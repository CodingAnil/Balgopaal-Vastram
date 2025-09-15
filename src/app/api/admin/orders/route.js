import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/lib/models/Order'

export async function GET(request) {
  try {
    await connectDB()

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    // Build filter
    const filter = {}
    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase()
    }

    // Get orders with populated user and product data
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate({
          path: 'user',
          select: 'name email phone address city state pincode',
        })
        .populate({
          path: 'items.productId',
          select: 'name price images slug category',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ])

    // Format orders for frontend
    const formattedOrders = orders.map((order) => ({
      id: order._id.toString(),
      orderId: order.orderId,
      user: order.user
        ? {
            id: order.user._id.toString(),
            name: order.user.name,
            email: order.user.email,
            phone: order.user.phone,
            address: `${order.user.address}, ${order.user.city}, ${order.user.state} - ${order.user.pincode}`,
          }
        : null,
      items: order.items.map((item) => ({
        id: item._id.toString(),
        productId: item.productId ? item.productId._id.toString() : null,
        product: item.productId
          ? {
              name: item.productId.name,
              price: item.productId.price,
              images: item.productId.images || [],
              slug: item.productId.slug,
              category: item.productId.category,
            }
          : null,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      shippingAddress: order.shippingAddress,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNext,
        hasPrev,
        limit,
      },
    })
  } catch (error) {
    console.error('Admin orders API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const {
      orderId,
      status,
      paymentStatus,
      trackingNumber,
      notes,
      estimatedDelivery,
    } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Build update object
    const updateData = {}
    if (status) updateData.status = status.toUpperCase()
    if (paymentStatus) updateData.paymentStatus = paymentStatus.toUpperCase()
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber
    if (notes !== undefined) updateData.notes = notes
    if (estimatedDelivery)
      updateData.estimatedDelivery = new Date(estimatedDelivery)

    // Update order
    const updatedOrder = await Order.findOneAndUpdate({ orderId }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: 'user',
        select: 'name email phone',
      })
      .populate({
        path: 'items.productId',
        select: 'name price images',
      })

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: updatedOrder._id.toString(),
        orderId: updatedOrder.orderId,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        trackingNumber: updatedOrder.trackingNumber,
        notes: updatedOrder.notes,
        estimatedDelivery: updatedOrder.estimatedDelivery,
        updatedAt: updatedOrder.updatedAt,
      },
    })
  } catch (error) {
    console.error('Admin order update error:', error)
    return NextResponse.json(
      {
        error: 'Failed to update order',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
