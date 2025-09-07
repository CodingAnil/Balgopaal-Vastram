import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import Order from '@/lib/models/Order'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { email } = params
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    // Build filter
    const filter = { user: user._id }
    if (status && status !== 'all') {
      filter.status = status.toUpperCase()
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.productId', 'name image slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter)
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderId: order.orderId,
      items: order.items.map(item => ({
        productId: item.productId?._id,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        image: item.productId?.image,
        slug: item.productId?.slug
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNext,
        hasPrev,
        limit
      }
    })

  } catch (error) {
    console.error('Get user orders error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch user orders',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
