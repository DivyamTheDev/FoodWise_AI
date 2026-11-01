import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Dairy',
        'Produce',
        'Vegetables',
        'Fruits',
        'Meat & Seafood',
        'Bakery',
        'Pantry',
        'Beverages',
        'Leftovers',
        'Other',
      ],
      default: 'Produce',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 1,
    },
    unit: {
      type: String,
      default: 'pcs',
      trim: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    storageLocation: {
      type: String,
      enum: ['Fridge', 'Freezer', 'Pantry', 'Countertop'],
      default: 'Fridge',
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    isConsumed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to calculate days until expiry
inventoryItemSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  // Compare based on midnight dates to avoid hourly skew
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const diffTime = expDateOnly.getTime() - nowDateOnly.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual property to get status category: 'expired', 'expiring_today', 'expiring_soon', 'good'
inventoryItemSchema.virtual('status').get(function () {
  const days = this.daysUntilExpiry;
  if (days === null) return 'good';
  if (days < 0) return 'expired';
  if (days === 0) return 'expiring_today';
  if (days <= 3) return 'expiring_soon';
  return 'good';
});

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export default InventoryItem;
