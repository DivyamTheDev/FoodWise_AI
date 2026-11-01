import React, { useState } from 'react';
import { X, Calendar, Plus, Tag, MapPin, DollarSign } from 'lucide-react';

const CATEGORIES = [
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

const LOCATIONS = ['Fridge', 'Freezer', 'Pantry', 'Countertop'];
const COMMON_UNITS = ['pcs', 'g', 'kg', 'ml', 'liters', 'pack', 'cans', 'bag', 'slices', 'cups'];

export default function AddItemModal({ isOpen, onClose, onAddItem }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    quantity: 1,
    unit: 'pcs',
    expiryDate: '',
    storageLocation: 'Fridge',
    estimatedCost: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const setRelativeExpiry = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, expiryDate: dateStr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide an item name');
      return;
    }
    if (!formData.expiryDate) {
      setError('Please select an expiration date');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddItem({
        ...formData,
        quantity: Number(formData.quantity) || 1,
        estimatedCost: Number(formData.estimatedCost) || 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Add Inventory Item</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track expiry and let AI generate recipes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Food Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Baby Spinach, Greek Yogurt, Salmon Fillet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category & Storage Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Storage
              </label>
              <select
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit
              </label>
              <input
                list="units"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, g, kg, liters"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
              <datalist id="units">
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Expiration Date with Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Expiration Date *
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setRelativeExpiry(2)}
                  className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 font-semibold rounded-md border border-amber-200 hover:bg-amber-100"
                >
                  +2d
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeExpiry(5)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200"
                >
                  +5d
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeExpiry(7)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200"
                >
                  +1w
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeExpiry(14)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md hover:bg-slate-200"
                >
                  +2w
                </button>
              </div>
            </div>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Estimated Cost (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Estimated Cost ($) <span className="text-slate-400 font-normal">Optional</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="2.99"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="w-full pl-8 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notes / Condition <span className="text-slate-400 font-normal">Optional</span>
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Slightly soft on one side, consume quickly or freeze"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Add to Inventory'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
