import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['VASTRA', 'MUKUT', 'BANSURI', 'ACCESSORIES'],
      uppercase: true,
    },
    color: {
      type: String,
      required: [true, 'Product color is required'],
      trim: true,
    },
    sizes: {
      type: [String],
      required: [true, 'At least one size is required'],
      validate: {
        validator: function (sizes) {
          const validSizes = ['0', '1', '2', '3', '4', '5', '6']
          return (
            sizes.length > 0 && sizes.every((size) => validSizes.includes(size))
          )
        },
        message: 'All sizes must be one of: 0, 1, 2, 3, 4, 5, 6',
      },
    },
    colors: {
      type: [String],
      required: [true, 'At least one color is required'],
      validate: {
        validator: function (colors) {
          return (
            colors.length > 0 &&
            colors.every((color) => color.trim().length > 0)
          )
        },
        message: 'At least one valid color must be provided',
      },
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required'],
      validate: {
        validator: function (images) {
          return (
            images.length > 0 &&
            images.every((image) => image.trim().length > 0)
          )
        },
        message: 'At least one valid image URL must be provided',
      },
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function (features) {
          return features.every((feature) => feature.trim().length > 0)
        },
        message: 'All features must be non-empty strings',
      },
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Create slug before saving
ProductSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }
  next()
})

// Index for search functionality
ProductSchema.index({ name: 'text', description: 'text' })
ProductSchema.index({ category: 1, color: 1, size: 1 })
ProductSchema.index({ price: 1 })

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema)
