import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Filter, 
  Flame, 
  SlidersHorizontal, 
  PlusCircle, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import RecipeCard from './RecipeCard.jsx';

const DIETARY_OPTIONS = ['Any / Flexible', 'Vegetarian', 'Vegan', 'High-Protein', 'Low-Carb', 'Gluten-Free', 'Dairy-Free'];
const COOK_TIMES = ['Under 15 mins', 'Under 30 mins', 'Under 45 mins', 'Any Time'];
const MEAL_TYPES = ['Any Meal', 'Dinner', 'Lunch', 'Breakfast', 'Snack / Appetizer'];

export default function RecipeGenerator({
  inventoryItems,
  preselectedItemIds = [],
  generatedRecipes,
  isGenerating,
  onGenerateRecipes,
  onOpenRecipeDetails,
  onSaveRecipe,
  onCookRecipe,
}) {
  const [selectedIds, setSelectedIds] = useState(preselectedItemIds);
  const [dietary, setDietary] = useState('Any / Flexible');
  const [cookTime, setCookTime] = useState('Under 30 mins');
  const [mealType, setMealType] = useState('Dinner');
  const [customPrompt, setCustomPrompt] = useState('');

  // Sync preselected items from outside (e.g. from Expiry Alerts)
  useEffect(() => {
    if (preselectedItemIds && preselectedItemIds.length > 0) {
      setSelectedIds(preselectedItemIds);
    }
  }, [preselectedItemIds]);

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const autoSelectExpiring = () => {
    const urgent = inventoryItems
      .filter((i) => i.status === 'expiring_today' || i.status === 'expiring_soon')
      .map((i) => i.id || i._id);
    setSelectedIds(urgent.length > 0 ? urgent : inventoryItems.slice(0, 4).map((i) => i.id || i._id));
  };

  const handleGenerate = () => {
    onGenerateRecipes({
      ingredientIds: selectedIds,
      preferences: {
        dietary: dietary === 'Any / Flexible' ? '' : dietary,
        cookTime,
        mealType,
        customPrompt,
      },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header & Configuration */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>AI Culinary Waste Reduction Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Leftover & Expiry Recipe Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Select what is sitting in your fridge or let our AI automatically prioritize items nearing expiration to turn potential waste into culinary masterpieces.
            </p>
          </div>

          <button
            onClick={autoSelectExpiring}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Auto-Pick Expiring Items</span>
          </button>
        </div>

        {/* Interactive Ingredients Selector */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pick Ingredients to Use ({selectedIds.length} Selected)
            </span>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200/80">
            {inventoryItems.map((item) => {
              const id = item.id || item._id;
              const isSelected = selectedIds.includes(id);
              const isUrgent = item.status === 'expiring_today' || item.status === 'expiring_soon';

              return (
                <button
                  key={id}
                  onClick={() => toggleItem(id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-sm ring-2 ring-violet-300'
                      : isUrgent
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-300 hover:bg-amber-200'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.quantity} {item.unit}
                  </span>
                  {isUrgent && !isSelected && (
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="mt-5 grid sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Dietary Preference
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {DIETARY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Desired Cook Time
            </label>
            <select
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {COOK_TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {MEAL_TYPES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom prompt request */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Optional chef notes (e.g. 'Must be kid-friendly', 'Make it spicy comfort food')..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        {/* Generate CTA Button */}
        <div className="mt-5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (inventoryItems.length === 0)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI Chef is concocting your zero-waste recipes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  {selectedIds.length > 0
                    ? `Generate Recipes with ${selectedIds.length} Selected Ingredients`
                    : 'Auto-Generate Recipes with Expiring Groceries'}
                </span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generated Recipes Section */}
      {generatedRecipes && generatedRecipes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600" />
              <span>AI Generated Suggestions</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Click any recipe to view step-by-step instructions
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {generatedRecipes.map((recipe, idx) => (
              <RecipeCard
                key={idx}
                recipe={recipe}
                onOpenDetails={onOpenRecipeDetails}
                onSave={onSaveRecipe}
                onCook={onCookRecipe}
                isSavedView={false}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
