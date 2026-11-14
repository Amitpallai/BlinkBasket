// server/models/Product.ts
import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  description: string[];
  price: number;
  offerPrice: number;
  image: string[];
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: [String],
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer price is required"],
      min: [0, "Offer price cannot be negative"],
       
    },
    image: {
      type: [String],
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Add pre-save middleware to handle offerPrice logic
productSchema.pre("save", function (next) {
  // If offerPrice is not set or is greater than price, set it to price
  if (!this.offerPrice || this.offerPrice > this.price) {
    this.offerPrice = this.price;
  }
  next();
});

// ✅ Add pre-update middleware for findOneAndUpdate operations
// ✅ Fix the pre-update middleware for findOneAndUpdate operations
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  const filter = this.getFilter();

  // Get the current document
  const doc = await this.model.findOne(filter);

  if (doc) {
    // Get the new price and offerPrice values
    const newPrice = update.price !== undefined ? update.price : doc.price;
    const newOfferPrice =
      update.offerPrice !== undefined ? update.offerPrice : doc.offerPrice;

    // Validate
    if (newOfferPrice > newPrice) {
      next(
        new Error(
          `Offer price (${newOfferPrice}) must be less than or equal to regular price (${newPrice})`,
        ),
      );
      return;
    }
  }

  next();
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
