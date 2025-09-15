import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      category,
      colors,
      sizes,
      images,
      features,
      originalPrice,
      discount = 0,
    } = body

    // Basic validation
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !colors ||
      !sizes ||
      !images
    ) {
      return NextResponse.json(
        {
          error:
            'All required fields must be provided: name, description, price, category, colors, sizes, images',
        },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['VASTRA', 'MUKUT', 'BANSURI', 'ACCESSORIES']
    if (!validCategories.includes(category.toUpperCase())) {
      return NextResponse.json(
        { error: `Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate arrays
    if (!Array.isArray(colors) || colors.length === 0) {
      return NextResponse.json(
        { error: 'At least one color must be provided' },
        { status: 400 }
      )
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json(
        { error: 'At least one size must be provided' },
        { status: 400 }
      )
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image must be provided' },
        { status: 400 }
      )
    }

    // Validate sizes
    const validSizes = ['0', '1', '2', '3', '4', '5', '6']
    const invalidSizes = sizes.filter((size) => !validSizes.includes(size))
    if (invalidSizes.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid sizes: ${invalidSizes.join(', ')}. Valid sizes are: ${validSizes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Validate colors and images are not empty
    const emptyColors = colors.filter(
      (color) => !color || color.trim().length === 0
    )
    if (emptyColors.length > 0) {
      return NextResponse.json(
        { error: 'All colors must be non-empty strings' },
        { status: 400 }
      )
    }

    const emptyImages = images.filter(
      (image) => !image || image.trim().length === 0
    )
    if (emptyImages.length > 0) {
      return NextResponse.json(
        { error: 'All image URLs must be non-empty strings' },
        { status: 400 }
      )
    }

    // Validate features if provided
    if (features && Array.isArray(features)) {
      const emptyFeatures = features.filter(
        (feature) => !feature || feature.trim().length === 0
      )
      if (emptyFeatures.length > 0) {
        return NextResponse.json(
          { error: 'All features must be non-empty strings' },
          { status: 400 }
        )
      }
    }

    await connectDB()

    // Create product data
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.toUpperCase(),
      colors: colors.map((color) => color.trim()),
      sizes: sizes,
      images: images.map((image) => image.trim()),
      features:
        features && Array.isArray(features)
          ? features.map((feature) => feature.trim())
          : [],
      discount: parseFloat(discount) || 0,
      // Keep backwards compatibility with single color field for existing components
      color: colors[0].trim(),
    }

    if (originalPrice && !isNaN(originalPrice) && originalPrice > 0) {
      productData.originalPrice = parseFloat(originalPrice)
    }

    const product = new Product(productData)
    await product.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Product added successfully',
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          colors: product.colors,
          sizes: product.sizes,
          images: product.images,
          features: product.features,
          slug: product.slug,
          discount: product.discount,
          originalPrice: product.originalPrice,
          createdAt: product.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add product error:', error)

    // Handle duplicate key error (if name/slug is not unique)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 409 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to add product',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
