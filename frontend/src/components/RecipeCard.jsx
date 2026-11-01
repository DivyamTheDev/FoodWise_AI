import React from 'react';
import { Clock, ChefHat, Sparkles, Heart, Trash2, CheckCircle2, Bookmark } from 'lucide-react';

export default function RecipeCard({
  recipe,
  onOpenDetails,
  onSave,
  onToggleFavorite,
  onDelete,
  onCook,
  isSavedView = false,
}) {
  const isFav = recipe.isFavorite;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner & Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                {recipe.difficulty || 'Easy'}
              </span>
              {recipe.dietaryTags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 
              onClick={() => onOpenDetails(recipe)}
              className="text-lg font-bold text-slate-800 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
            >
              {recipe.title}
            </h3>
          </div>

          {/* Top Actions: Favorite / Save */}
          <div className="shrink-0 flex items-center gap-1">
            {isSavedView ? (
              <>
                <button
                  onClick={() => onToggleFavorite && onToggleFavorite(recipe._id || recipe.id)}
                  title="Toggle Favorite"
                  className={`p-2 rounded-xl transition-colors ${
                    isFav ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  onClick={() => onDelete && onDelete(recipe._id || recipe.id)}
                  title="Remove Recipe"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onSave && onSave(recipe)}
                title="Save Recipe to Cookbook"
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Cooking Info Meta */}
        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Prep: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Cook: {recipe.cookTime}</span>
          </div>
          <div>
            <span>Serves: {recipe.servings}</span>
          </div>
        </div>

        {/* Ingredients from your inventory */}
        <div className="mt-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Uses from your inventory:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.usedIngredients?.map((ing, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                ✓ {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Waste Prevention Chef Tip */}
        {recipe.wastePreventionTip && (
          <div className="mt-3 bg-amber-50/60 border border-amber-200/70 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-snug">
              <strong>Zero-Waste Tip:</strong> {recipe.wastePreventionTip}
            </span>
          </div>
        )}
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetails(recipe)}
          className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors text-center"
        >
          View Full Recipe
        </button>

        <button
          onClick={() => onCook && onCook(recipe)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95"
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Cook (Deduct)</span>
        </button>
      </div>

    </div>
  );
}
