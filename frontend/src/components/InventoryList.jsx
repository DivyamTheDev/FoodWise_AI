import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Edit3, 
  Clock, 
  Package, 
  ChevronRight,
  ArrowUpDown,
  Utensils
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Produce',
  'Dairy',
  'Vegetables',
  'Fruits',
  'Meat & Seafood',
  'Bakery',
  'Pantry',
  'Beverages',
  'Leftovers',
  'Other',
];

const LOCATIONS = ['All', 'Fridge', 'Freezer', 'Pantry', 'Countertop'];

export default function InventoryList({
  items,
  isLoading,
  onOpenAddModal,
  onEditItem,
  onDeleteItem,
  onConsumeItem,
  onUpdateQuantity,
  onGenerateRecipesForSelected,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Filter items locally for instant responsiveness
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || item.storageLocation === selectedLocation;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  const toggleSelect = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllExpiring = () => {
    const urgentIds = items
      .filter((i) => i.status === 'expiring_today' || i.status === 'expiring_soon')
      .map((i) => i.id || i._id);
    setSelectedItemIds(urgentIds);
  };

  const clearSelection = () => setSelectedItemIds([]);

  const handleGenerate = () => {
    if (selectedItemIds.length > 0) {
      onGenerateRecipesForSelected(selectedItemIds);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls: Search, Filters, Add Button */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search food by name or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={selectAllExpiring}
              className="text-xs px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-xl transition-colors border border-amber-200"
            >
              Select All Expiring
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Filters: Location & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="expiring_today">Expiring Today</option>
              <option value="expiring_soon">Expiring in 1-3 Days</option>
              <option value="good">Fresh / Safe</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Sticky Bar when items are selected */}
      {selectedItemIds.length > 0 && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{selectedItemIds.length} item(s) selected for recipe generation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="text-xs px-2.5 py-1.5 text-white/80 hover:text-white font-medium"
            >
              Deselect All
            </button>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-violet-900 font-bold text-xs rounded-xl shadow hover:bg-violet-50 transition-all active:scale-95"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Generate AI Recipe Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Items Table / Cards */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading your pantry inventory...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No inventory items found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || selectedCategory !== 'All'
              ? 'Try clearing your search query or changing active category filters.'
              : 'Add fresh ingredients or load sample items using the Reset button!'}
          </p>
          <div className="mt-4">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm"
            >
              + Add First Food Item
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const id = item.id || item._id;
              const isSelected = selectedItemIds.includes(id);

              return (
                <div
                  key={id}
                  className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected ? 'bg-violet-50/50' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Left: Checkbox + Name + Badges */}
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(id)}
                      className="mt-1 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-base">{item.name}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                          {item.storageLocation}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>
                          Added: {new Date(item.purchaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {item.estimatedCost > 0 && (
                          <span>
                            Cost: <strong className="text-slate-700">${item.estimatedCost.toFixed(2)}</strong>
                          </span>
                        )}
                        {item.notes && (
                          <span className="italic text-slate-400 truncate max-w-xs">
                            "{item.notes}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Quantity Adjuster */}
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(id, Math.max(0, item.quantity - 1))}
                        className="px-2 py-1 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-800 bg-white">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right: Expiry badge + action menu */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
                    {/* Status Pill */}
                    <div className="text-right">
                      {item.status === 'expired' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          Expired ({Math.abs(item.daysUntilExpiry)}d ago)
                        </span>
                      )}
                      {item.status === 'expiring_today' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse shadow-sm">
                          Expires TODAY
                        </span>
                      )}
                      {item.status === 'expiring_soon' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {item.daysUntilExpiry} days left
                        </span>
                      )}
                      {item.status === 'good' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Fresh ({item.daysUntilExpiry}d)
                        </span>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Exp: {new Date(item.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onGenerateRecipesForSelected([id])}
                        title="Generate AI recipe with this ingredient"
                        className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onConsumeItem(id, item.quantity)}
                        title="Mark used up"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteItem(id)}
                        title="Delete item"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
