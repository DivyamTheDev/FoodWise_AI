import React, { useState } from 'react';
import { X, Clock, ChefHat, Check, Sparkles, Bookmark, CheckCircle2 } from 'lucide-react';

export default function RecipeDetailModal({ recipe, isOpen, onClose, onSave, onCook, isSavedView = false }) {
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  if (!isOpen || !recipe) return null;

  const toggleIngredient = (ing) => {
    setCheckedIngredients((prev) => ({ ...prev, [ing]: !prev[ing] }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                {recipe.difficulty || 'Easy'}
              </span>
              {recipe.dietaryTags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{recipe.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{recipe.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Meta */}
        <div className="grid grid-cols-3 gap-3 my-4 py-3 px-4 bg-slate-50 rounded-2xl text-center">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Prep Time</p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{recipe.prepTime}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Cook Time</p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{recipe.cookTime}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Yield</p>
            <p className="text-sm font-extrabold text-slate-800 mt-0.5">{recipe.servings} Servings</p>
          </div>
        </div>

        {/* Zero-Waste Chef Tip */}
        {recipe.wastePreventionTip && (
          <div className="mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">Zero-Waste Sustainability Insight</p>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{recipe.wastePreventionTip}</p>
            </div>
          </div>
        )}

        {/* Ingredients Checklist */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Ingredients Checklist (Click to cross off)
          </h4>
          
          <div className="space-y-1.5">
            {/* From Inventory */}
            {recipe.usedIngredients?.map((ing, idx) => {
              const isDone = checkedIngredients[ing];
              return (
                <div
                  key={`used_${idx}`}
                  onClick={() => toggleIngredient(ing)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                    isDone
                      ? 'bg-slate-50 text-slate-400 line-through border-slate-200'
                      : 'bg-emerald-50/60 text-emerald-900 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-emerald-400 bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3" />}
                  </div>
                  <span className="font-semibold">{ing}</span>
                  <span className="text-[10px] ml-auto font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    From Inventory
                  </span>
                </div>
              );
            })}

            {/* Additional Pantry Staples */}
            {recipe.additionalIngredients?.map((ing, idx) => {
              const isDone = checkedIngredients[ing];
              return (
                <div
                  key={`add_${idx}`}
                  onClick={() => toggleIngredient(ing)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                    isDone
                      ? 'bg-slate-50 text-slate-400 line-through border-slate-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isDone ? 'bg-slate-700 border-slate-700 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3" />}
                  </div>
                  <span>{ing}</span>
                  <span className="text-[10px] ml-auto text-slate-400 uppercase font-semibold">Pantry Staple</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Cooking Instructions
          </h4>

          <div className="space-y-2.5">
            {recipe.instructions?.map((step, idx) => {
              const isStepDone = completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3 rounded-2xl border text-xs leading-relaxed cursor-pointer transition-all flex items-start gap-3 ${
                    isStepDone
                      ? 'bg-slate-50 text-slate-400 border-slate-200'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isStepDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isStepDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <p className={isStepDone ? 'line-through' : ''}>{step}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {!isSavedView && onSave && (
            <button
              onClick={() => onSave(recipe)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save to Cookbook</span>
            </button>
          )}

          <button
            onClick={() => {
              onCook && onCook(recipe);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <ChefHat className="w-4 h-4" />
            <span>Finished Cooking! (Deduct Used Items)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
