import store from '../services/store.js';
import { generateRecipesWithAI } from '../services/geminiService.js';

export const getSavedRecipes = async (req, res) => {
  try {
    const recipes = await store.getRecipes();
    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateRecipes = async (req, res) => {
  try {
    const { ingredientIds, preferences } = req.body;

    let ingredientsToUse = [];

    if (ingredientIds && Array.isArray(ingredientIds) && ingredientIds.length > 0) {
      // Find selected items
      const allItems = await store.getItems();
      ingredientsToUse = allItems.filter((i) => ingredientIds.includes(i.id) || ingredientIds.includes(i._id));
    } else {
      // Automatically pull items expiring today, expiring soon, or first 5 items
      const allItems = await store.getItems();
      const urgentItems = allItems.filter((i) => i.status === 'expiring_today' || i.status === 'expiring_soon');
      ingredientsToUse = urgentItems.length > 0 ? urgentItems : allItems.slice(0, 5);
    }

    if (ingredientsToUse.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No available ingredients found in inventory to generate recipes from. Please add some items first!',
      });
    }

    const recipes = await generateRecipesWithAI(ingredientsToUse, preferences || {});

    res.json({
      success: true,
      usedIngredients: ingredientsToUse.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: `${i.quantity} ${i.unit}`,
        daysUntilExpiry: i.daysUntilExpiry,
        status: i.status,
      })),
      data: recipes,
    });
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const recipeData = req.body;
    if (!recipeData.title) {
      return res.status(400).json({ success: false, message: 'Recipe title is required' });
    }

    const saved = await store.createRecipe({
      ...recipeData,
      isFavorite: true,
    });

    res.status(201).json({
      success: true,
      message: 'Recipe saved to your cookbook!',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const recipe = await store.toggleFavoriteRecipe(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const deleted = await store.deleteRecipe(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, message: 'Recipe removed from saved list' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cookRecipe = async (req, res) => {
  try {
    const { usedIngredients } = req.body;
    if (!usedIngredients || !Array.isArray(usedIngredients) || usedIngredients.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide ingredients used' });
    }

    const allItems = await store.getItems();
    const updatedItems = [];

    for (const ingName of usedIngredients) {
      const match = allItems.find((item) =>
        item.name.toLowerCase().includes(ingName.toLowerCase()) || ingName.toLowerCase().includes(item.name.toLowerCase())
      );
      if (match) {
        // Reduce quantity or mark consumed
        const newQty = Math.max(0, match.quantity - 1);
        const updated = await store.updateItem(match.id, {
          quantity: newQty,
          isConsumed: newQty === 0,
        });
        updatedItems.push(updated);
      }
    }

    res.json({
      success: true,
      message: `Cooked! Updated ${updatedItems.length} inventory items.`,
      updatedItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
