import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const skip = (page - 1) * limit

    // Filter parameters
    const category = searchParams.get('category')
    const color = searchParams.get('color')
    const size = searchParams.get('size')
    const search = searchParams.get('search')
    const inStock = searchParams.get('inStock')

    // Sort parameter
    const sort = searchParams.get('sort') || 'name-asc'

    // Build filter object
    const filter = {}

    if (category && category !== 'All Categories') {
      filter.category = category.toUpperCase()
    }

    if (color && color !== 'All Colors') {
      filter.color = new RegExp(color, 'i')
    }

    if (size && size !== 'All Sizes') {
      filter.size = size
    }

    if (inStock !== null && inStock !== undefined && inStock !== '') {
      filter.inStock = inStock === 'true'
    }

    // Text search
    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { description: new RegExp(search.trim(), 'i') },
        { color: new RegExp(search.trim(), 'i') },
      ]
    }

    // Build sort object
    let sortObj = {}
    switch (sort) {
      case 'name-asc':
        sortObj.name = 1
        break
      case 'name-desc':
        sortObj.name = -1
        break
      case 'price-low':
        sortObj.price = 1
        break
      case 'price-high':
        sortObj.price = -1
        break
      case 'newest':
        sortObj.createdAt = -1
        break
      case 'oldest':
        sortObj.createdAt = 1
        break
      default:
        sortObj.name = 1
    }

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    // Get unique filter options for frontend
    const [categories, colors, sizes] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('color'),
      Product.distinct('size'),
    ])

    // Format products with id compatibility
    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      id: product._id.toString(), // Add id for compatibility with favorites
    }))

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext,
        hasPrev,
        limit,
      },
      filters: {
        categories: categories.sort(),
        colors: colors.sort(),
        sizes: sizes.sort((a, b) => parseInt(a) - parseInt(b)),
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
