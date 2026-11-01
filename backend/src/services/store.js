import mongoose from 'mongoose';
import InventoryItem from '../models/InventoryItem.js';
import Recipe from '../models/Recipe.js';
import { getInitialDummyItems, getInitialDummyRecipes } from './seedService.js';
import crypto from 'crypto';

// In-Memory store fallback in case MongoDB Cloud is not yet connected
let memoryItems = [];
let memoryRecipes = [];
let memoryInitialized = false;

const computeItemMetadata = (item) => {
  const plain = typeof item.toObject === 'function' ? item.toObject({ virtuals: true }) : { ...item };
  const now = new Date();
  const expiry = new Date(plain.expiryDate);
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const diffTime = expDateOnly.getTime() - nowDateOnly.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let status = 'good';
  if (days < 0) status = 'expired';
  else if (days === 0) status = 'expiring_today';
  else if (days <= 3) status = 'expiring_soon';

  return {
    ...plain,
    id: plain._id ? plain._id.toString() : plain.id,
    daysUntilExpiry: days,
    status,
  };
};

const initMemoryStore = () => {
  if (!memoryInitialized) {
    const dummy = getInitialDummyItems();
    memoryItems = dummy.map((it, idx) => ({
      ...it,
      _id: `mem_${idx + 1}_${Date.now()}`,
      id: `mem_${idx + 1}_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const dummyRecipes = getInitialDummyRecipes();
    memoryRecipes = dummyRecipes.map((rcp, idx) => ({
      ...rcp,
      _id: `rec_${idx + 1}_${Date.now()}`,
      id: `rec_${idx + 1}_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    memoryInitialized = true;
  }
};

const isMongooseActive = () => mongoose.connection.readyState === 1;

export const store = {
  async ensureSeeded() {
    if (isMongooseActive()) {
      const count = await InventoryItem.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding initial dummy items into MongoDB Cloud...');
        const dummyItems = getInitialDummyItems();
        await InventoryItem.insertMany(dummyItems);
      }
      const recipeCount = await Recipe.countDocuments();
      if (recipeCount === 0) {
        console.log('🌱 Seeding initial dummy recipes into MongoDB Cloud...');
        const dummyRecipes = getInitialDummyRecipes();
        await Recipe.insertMany(dummyRecipes);
      }
    } else {
      initMemoryStore();
    }
  },

  async getItems({ category, status, search, location } = {}) {
    await this.ensureSeeded();

    let items;
    if (isMongooseActive()) {
      const query = { isConsumed: { $ne: true } };
      if (category && category !== 'All') query.category = category;
      if (location && location !== 'All') query.storageLocation = location;
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      const raw = await InventoryItem.find(query).sort({ expiryDate: 1 });
      items = raw.map(computeItemMetadata);
    } else {
      items = memoryItems
        .filter((i) => !i.isConsumed)
        .map(computeItemMetadata);

      if (category && category !== 'All') {
        items = items.filter((i) => i.category === category);
      }
      if (location && location !== 'All') {
        items = items.filter((i) => i.storageLocation === location);
      }
      if (search) {
        const s = search.toLowerCase();
        items = items.filter((i) => i.name.toLowerCase().includes(s) || (i.notes && i.notes.toLowerCase().includes(s)));
      }
      items.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }

    if (status && status !== 'All') {
      items = items.filter((i) => i.status === status);
    }
    return items;
  },

  async getItemById(id) {
    if (isMongooseActive() && mongoose.isValidObjectId(id)) {
      const item = await InventoryItem.findById(id);
      return item ? computeItemMetadata(item) : null;
    }
    const memItem = memoryItems.find((i) => i.id === id || i._id === id);
    return memItem ? computeItemMetadata(memItem) : null;
  },

  async createItem(itemData) {
    if (isMongooseActive()) {
      const created = await InventoryItem.create(itemData);
      return computeItemMetadata(created);
    }
    initMemoryStore();
    const newItem = {
      ...itemData,
      _id: `mem_${crypto.randomUUID()}`,
      id: `mem_${crypto.randomUUID()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isConsumed: false,
    };
    memoryItems.unshift(newItem);
    return computeItemMetadata(newItem);
  },

  async updateItem(id, updateData) {
    if (isMongooseActive() && mongoose.isValidObjectId(id)) {
      const updated = await InventoryItem.findByIdAndUpdate(id, updateData, { new: true });
      return updated ? computeItemMetadata(updated) : null;
    }
    const idx = memoryItems.findIndex((i) => i.id === id || i._id === id);
    if (idx !== -1) {
      memoryItems[idx] = {
        ...memoryItems[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      return computeItemMetadata(memoryItems[idx]);
    }
    return null;
  },

  async deleteItem(id) {
    if (isMongooseActive() && mongoose.isValidObjectId(id)) {
      const deleted = await InventoryItem.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = memoryItems.findIndex((i) => i.id === id || i._id === id);
    if (idx !== -1) {
      memoryItems.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getAlerts() {
    const items = await this.getItems();
    const expired = items.filter((i) => i.status === 'expired');
    const expiringToday = items.filter((i) => i.status === 'expiring_today');
    const expiringSoon = items.filter((i) => i.status === 'expiring_soon');

    const totalAtRiskCost = [...expired, ...expiringToday, ...expiringSoon].reduce(
      (sum, item) => sum + (Number(item.estimatedCost) || 0),
      0
    );

    return {
      totalAlerts: expired.length + expiringToday.length + expiringSoon.length,
      expired,
      expiringToday,
      expiringSoon,
      freshCount: items.filter((i) => i.status === 'good').length,
      totalItems: items.length,
      totalAtRiskCost: Number(totalAtRiskCost.toFixed(2)),
    };
  },

  async getRecipes() {
    await this.ensureSeeded();
    if (isMongooseActive()) {
      return await Recipe.find().sort({ createdAt: -1 });
    }
    return memoryRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createRecipe(recipeData) {
    if (isMongooseActive()) {
      return await Recipe.create(recipeData);
    }
    initMemoryStore();
    const newRecipe = {
      ...recipeData,
      _id: `rec_${crypto.randomUUID()}`,
      id: `rec_${crypto.randomUUID()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryRecipes.unshift(newRecipe);
    return newRecipe;
  },

  async toggleFavoriteRecipe(id) {
    if (isMongooseActive() && mongoose.isValidObjectId(id)) {
      const recipe = await Recipe.findById(id);
      if (!recipe) return null;
      recipe.isFavorite = !recipe.isFavorite;
      await recipe.save();
      return recipe;
    }
    const rcp = memoryRecipes.find((r) => r.id === id || r._id === id);
    if (rcp) {
      rcp.isFavorite = !rcp.isFavorite;
      return rcp;
    }
    return null;
  },

  async deleteRecipe(id) {
    if (isMongooseActive() && mongoose.isValidObjectId(id)) {
      return await Recipe.findByIdAndDelete(id);
    }
    const idx = memoryRecipes.findIndex((r) => r.id === id || r._id === id);
    if (idx !== -1) {
      memoryRecipes.splice(idx, 1);
      return true;
    }
    return false;
  },

  async resetSeed() {
    if (isMongooseActive()) {
      await InventoryItem.deleteMany({});
      await Recipe.deleteMany({});
      const dummyItems = getInitialDummyItems();
      await InventoryItem.insertMany(dummyItems);
      const dummyRecipes = getInitialDummyRecipes();
      await Recipe.insertMany(dummyRecipes);
    }
    memoryInitialized = false;
    initMemoryStore();
    return true;
  },
};

export default store;
