import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DashboardStats from './components/DashboardStats.jsx';
import InventoryList from './components/InventoryList.jsx';
import ExpiryAlerts from './components/ExpiryAlerts.jsx';
import RecipeGenerator from './components/RecipeGenerator.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import AddItemModal from './components/AddItemModal.jsx';
import RecipeDetailModal from './components/RecipeDetailModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { inventoryApi, alertsApi, recipeApi, healthApi } from './services/api.js';
import { Sparkles, BookOpen, AlertTriangle, Package, ChefHat } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Data state
  const [inventoryItems, setInventoryItems] = useState([]);
  const [alertsData, setAlertsData] = useState(null);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);

  // Interaction & Modal state
  const [preselectedItemIds, setPreselectedItemIds] = useState([]);
  const [selectedRecipeForDetail, setSelectedRecipeForDetail] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Loading states
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      fetchInventory(),
      fetchAlerts(),
      fetchSavedRecipes(),
      fetchStatus(),
    ]);
  };

  const fetchInventory = async () => {
    try {
      setIsLoadingItems(true);
      const res = await inventoryApi.getAll();
      if (res.data.success) {
        setInventoryItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await alertsApi.getAlerts();
      if (res.data.success) {
        setAlertsData(res.data.alerts);
        setAiAdvice(res.data.aiAdvice);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const res = await recipeApi.getSaved();
      if (res.data.success) {
        setSavedRecipes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch saved recipes:', err);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await inventoryApi.getStatus();
      if (res.data.success) {
        setDbStatus(res.data.database);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  // Inventory actions
  const handleAddItem = async (itemData) => {
    const res = await inventoryApi.create(itemData);
    if (res.data.success) {
      showToast(`Added "${itemData.name}" to inventory!`);
      await fetchInventory();
      await fetchAlerts();
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      const res = await inventoryApi.delete(id);
      if (res.data.success) {
        showToast('Item deleted');
        await fetchInventory();
        await fetchAlerts();
      }
    }
  };

  const handleConsumeItem = async (id, quantity) => {
    const res = await inventoryApi.consume(id, quantity);
    if (res.data.success) {
      showToast(res.data.message || 'Item marked as used!');
      await fetchInventory();
      await fetchAlerts();
    }
  };

  const handleUpdateQuantity = async (id, newQty) => {
    if (newQty <= 0) {
      handleConsumeItem(id, 1);
      return;
    }
    const res = await inventoryApi.update(id, { quantity: newQty });
    if (res.data.success) {
      setInventoryItems((prev) =>
        prev.map((i) => (i.id === id || i._id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  // Seed Dummy Data
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await inventoryApi.seedDummy();
      if (res.data.success) {
        showToast('Loaded realistic sample pantry & recipe data!');
        await loadAllData();
      }
    } catch (err) {
      showToast('Error seeding sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // AI Recipe Actions
  const handleGenerateRecipes = async (payload) => {
    try {
      setIsGenerating(true);
      const res = await recipeApi.generate(payload);
      if (res.data.success) {
        setGeneratedRecipes(res.data.data);
        showToast('AI Chef generated 2 zero-waste recipes!');
        // scroll down smoothly
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to generate recipes', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateForIngredients = (ingredientIds) => {
    setPreselectedItemIds(ingredientIds);
    setActiveTab('recipes');
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      const res = await recipeApi.save(recipe);
      if (res.data.success) {
        showToast('Saved to your Cookbook!');
        await fetchSavedRecipes();
      }
    } catch (err) {
      showToast('Recipe already in cookbook or failed to save', 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    const res = await recipeApi.toggleFavorite(id);
    if (res.data.success) {
      await fetchSavedRecipes();
    }
  };

  const handleDeleteRecipe = async (id) => {
    const res = await recipeApi.delete(id);
    if (res.data.success) {
      showToast('Removed from saved recipes');
      await fetchSavedRecipes();
    }
  };

  const handleCookRecipe = async (recipe) => {
    try {
      const used = recipe.usedIngredients || [];
      if (used.length === 0) return;

      const res = await recipeApi.cook(used);
      if (res.data.success) {
        showToast(res.data.message || 'Cooking finished! Inventory updated.');
        await fetchInventory();
        await fetchAlerts();
      }
    } catch (err) {
      showToast('Failed to update inventory', 'error');
    }
  };

  const alertCount = alertsData?.totalAlerts || 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-slideDown">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-semibold border ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alertCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onSeedData={handleSeedData}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        dbStatus={dbStatus}
        isSeeding={isSeeding}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Summary Metrics */}
        <DashboardStats
          alertsData={alertsData}
          onGoToAlerts={() => setActiveTab('alerts')}
          onGoToRecipes={() => {
            const urgentIds = inventoryItems
              .filter((i) => i.status === 'expiring_today' || i.status === 'expiring_soon')
              .map((i) => i.id || i._id);
            handleGenerateForIngredients(urgentIds);
          }}
        />

        {/* Tab 1: Inventory View */}
        {activeTab === 'inventory' && (
          <InventoryList
            items={inventoryItems}
            isLoading={isLoadingItems}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteItem={handleDeleteItem}
            onConsumeItem={handleConsumeItem}
            onUpdateQuantity={handleUpdateQuantity}
            onGenerateRecipesForSelected={handleGenerateForIngredients}
          />
        )}

        {/* Tab 2: Expiry Alerts */}
        {activeTab === 'alerts' && (
          <ExpiryAlerts
            alertsData={alertsData}
            aiAdvice={aiAdvice}
            onGenerateForIngredients={handleGenerateForIngredients}
            onConsumeItem={handleConsumeItem}
            onDeleteItem={handleDeleteItem}
            onRefreshAlerts={fetchAlerts}
          />
        )}

        {/* Tab 3: AI Recipe Generator */}
        {activeTab === 'recipes' && (
          <RecipeGenerator
            inventoryItems={inventoryItems}
            preselectedItemIds={preselectedItemIds}
            generatedRecipes={generatedRecipes}
            isGenerating={isGenerating}
            onGenerateRecipes={handleGenerateRecipes}
            onOpenRecipeDetails={(rcp) => setSelectedRecipeForDetail(rcp)}
            onSaveRecipe={handleSaveRecipe}
            onCookRecipe={handleCookRecipe}
          />
        )}

        {/* Tab 4: Saved Cookbook */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  <span>My Zero-Waste Cookbook</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Saved culinary recipes ready to cook whenever you have ingredients
                </p>
              </div>
            </div>

            {savedRecipes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800">No saved recipes yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Generate creative dishes from your expiring groceries in the AI Recipes tab and bookmark your favorites here!
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl"
                  >
                    Go to AI Recipe Studio
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {savedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id || recipe.id}
                    recipe={recipe}
                    onOpenDetails={(rcp) => setSelectedRecipeForDetail(rcp)}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteRecipe}
                    onCook={handleCookRecipe}
                    isSavedView={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center">
        <p className="text-xs font-bold text-slate-800 tracking-wide">
          Build by team byteBite
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Food Optimizer AI v1.0 • Powered by Groq AI & MongoDB Cloud Atlas
        </p>
      </footer>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <RecipeDetailModal
        recipe={selectedRecipeForDetail}
        isOpen={Boolean(selectedRecipeForDetail)}
        onClose={() => setSelectedRecipeForDetail(null)}
        onSave={handleSaveRecipe}
        onCook={handleCookRecipe}
        isSavedView={activeTab === 'saved'}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        dbStatus={dbStatus}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
        onRefreshStatus={loadAllData}
      />

    </div>
  );
}
