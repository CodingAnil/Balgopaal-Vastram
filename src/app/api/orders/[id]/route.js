import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/lib/models/Order'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID parameter is required' },
        { status: 400 }
      )
    }

    // Find order by either MongoDB _id or orderId
    let order
    
    // Check if it's a MongoDB ObjectId format
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id)
    } else {
      // Otherwise, search by orderId
      order = await Order.findOne({ orderId: id })
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Populate order with user and product details
    await order.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'items.productId', select: 'name image slug category' }
    ])

    // Format order for response
    const formattedOrder = {
      id: order._id,
      orderId: order.orderId,
      user: {
        id: order.user._id,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone
      },
      items: order.items.map(item => ({
        productId: item.productId?._id,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        image: item.productId?.image,
        slug: item.productId?.slug,
        category: item.productId?.category
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      shippingAddress: order.shippingAddress,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder
    })

  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID parameter is required' },
        { status: 400 }
      )
    }

    // Find order
    let order
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id)
    } else {
      order = await Order.findOne({ orderId: id })
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update allowed fields
    const allowedUpdates = ['status', 'paymentStatus', 'trackingNumber', 'notes', 'estimatedDelivery']
    const updates = {}

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        if (field === 'status') {
          const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
          if (!validStatuses.includes(body[field].toUpperCase())) {
            return NextResponse.json(
              { error: `Status must be one of: ${validStatuses.join(', ')}` },
              { status: 400 }
            )
          }
          updates[field] = body[field].toUpperCase()
        } else if (field === 'paymentStatus') {
          const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
          if (!validPaymentStatuses.includes(body[field].toUpperCase())) {
            return NextResponse.json(
              { error: `Payment status must be one of: ${validPaymentStatuses.join(', ')}` },
              { status: 400 }
            )
          }
          updates[field] = body[field].toUpperCase()
        } else if (field === 'estimatedDelivery') {
          updates[field] = new Date(body[field])
        } else {
          updates[field] = body[field]
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update order
    Object.assign(order, updates)
    await order.save()

    // Populate for response
    await order.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'items.productId', select: 'name image slug category' }
    ])

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: order._id,
        orderId: order.orderId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
        estimatedDelivery: order.estimatedDelivery,
        updatedAt: order.updatedAt
      }
    })

  } catch (error) {
    console.error('Update order error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to update order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
