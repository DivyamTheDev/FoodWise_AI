import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Package, 
  BookOpen, 
  Plus, 
  Database, 
  RotateCcw,
  Settings
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  alertCount,
  onOpenAddModal,
  onSeedData,
  onOpenSettings,
  dbStatus,
  isSeeding
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inventory')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <span className="text-xl">🥗</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Food Optimizer</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AI v1
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Smart Inventory & Zero-Waste Recipes</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'alerts'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Expiry Alerts</span>
              {alertCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-500 rounded-full animate-pulse">
                  {alertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'recipes'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span>AI Recipes</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Cookbook</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* DB Status indicator */}
            <button
              onClick={onOpenSettings}
              title={dbStatus?.isConnected ? 'MongoDB Cloud Connected' : 'Running in Local Store Mode'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus?.isConnected ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'}`}></span>
              <span className="hidden sm:inline">
                {dbStatus?.isConnected ? 'Cloud DB' : 'Local Store'}
              </span>
            </button>

            {/* Seed Dummy Data Button */}
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              title="Reset and populate sample food inventory"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className={`w-4 h-4 ${isSeeding ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Settings & Cloud Config"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Add Item CTA */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Food Item</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center gap-1 relative ${activeTab === 'alerts' ? 'text-amber-600 font-bold' : 'text-slate-500'}`}
          >
            <div className="relative">
              <AlertTriangle className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </div>
            <span>Alerts</span>
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'recipes' ? 'text-violet-600 font-bold' : 'text-slate-500'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Recipes</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'saved' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cookbook</span>
          </button>
        </div>
      </div>
    </header>
  );
}
