import mongoose from 'mongoose';

const { Schema } = mongoose;

const harvestSchema = new Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer reference is required']
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
      index: true
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    blockchainTxHash: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient farmer/status queries
harvestSchema.index({ farmerId: 1, status: 1 });

const Harvest = mongoose.model('Harvest', harvestSchema);

export default Harvest;

