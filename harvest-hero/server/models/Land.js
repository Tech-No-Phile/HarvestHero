import mongoose from 'mongoose';

const { Schema } = mongoose;

const landSchema = new Schema(
  {
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
      min: [0.1, 'Size cannot be negative, must be at least 0.1acres']
    },
    leasePrice: {
      type: Number,
      required: [true, 'Lease price is required'],
      min: [0, 'Lease price cannot be negative']
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner reference is required']
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'leased'],
      default: 'available',
      index: true
    },
    leasedTo: {
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


landSchema.index({ ownerId: 1, status: 1 });
const Land = mongoose.model('Land', landSchema);

export default Land;

