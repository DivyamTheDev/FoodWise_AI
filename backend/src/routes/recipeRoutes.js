import express from 'express';
import {
  getSavedRecipes,
  generateRecipes,
  saveRecipe,
  toggleFavorite,
  deleteRecipe,
  cookRecipe,
} from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getSavedRecipes);
router.post('/generate', generateRecipes);
router.post('/save', saveRecipe);
router.post('/cook', cookRecipe);
router.patch('/:id/favorite', toggleFavorite);
router.delete('/:id', deleteRecipe);

export default router;
