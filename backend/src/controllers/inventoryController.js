import store from '../services/store.js';
import { getDbStatus, connectDB } from '../config/db.js';

export const getInventory = async (req, res) => {
  try {
    const { category, status, search, location } = req.query;
    const items = await store.getItems({ category, status, search, location });
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await store.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, purchaseDate, expiryDate, storageLocation, estimatedCost, notes } = req.body;

    if (!name || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Name and Expiry Date are required',
      });
    }

    const newItem = await store.createItem({
      name,
      category: category || 'Produce',
      quantity: Number(quantity) || 1,
      unit: unit || 'pcs',
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      expiryDate: new Date(expiryDate),
      storageLocation: storageLocation || 'Fridge',
      estimatedCost: Number(estimatedCost) || 0,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: newItem,
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const updated = await store.updateItem(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({
      success: true,
      message: 'Item updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deleted = await store.deleteItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted from inventory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const consumeItem = async (req, res) => {
  try {
    const { quantityToConsume } = req.body;
    const item = await store.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const amount = Number(quantityToConsume) || item.quantity;
    const remaining = Math.max(0, item.quantity - amount);

    let updated;
    if (remaining === 0) {
      updated = await store.updateItem(req.params.id, { isConsumed: true, quantity: 0 });
    } else {
      updated = await store.updateItem(req.params.id, { quantity: remaining });
    }

    res.json({
      success: true,
      message: remaining === 0 ? 'Item completely used!' : `Updated: ${remaining} ${item.unit} remaining`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedDummyData = async (req, res) => {
  try {
    await store.resetSeed();
    const items = await store.getItems();
    res.json({
      success: true,
      message: 'Sample inventory & recipes re-seeded successfully!',
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    res.json({
      success: true,
      database: dbStatus,
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_gemini')),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
