import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    prepTime: {
      type: String,
      default: '15 mins',
    },
    cookTime: {
      type: String,
      default: '20 mins',
    },
    servings: {
      type: Number,
      default: 2,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    usedIngredients: [
      {
        type: String,
        trim: true,
      },
    ],
    additionalIngredients: [
      {
        type: String,
        trim: true,
      },
    ],
    instructions: [
      {
        type: String,
        trim: true,
      },
    ],
    wastePreventionTip: {
      type: String,
      default: '',
    },
    dietaryTags: [
      {
        type: String,
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
