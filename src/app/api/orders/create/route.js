import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import { sendOrderEmail } from '@/lib/utils/sendEmail'

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    console.log('Order creation request body:', JSON.stringify(body, null, 2))
    const {
      userInfo,
      items,
      subtotal,
      shipping = 0,
      tax = 0,
      total,
      paymentMethod = 'RAZORPAY',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = body

    // Validation
    if (!userInfo || !items || !Array.isArray(items) || items.length === 0) {
      console.error('Validation failed - missing basic data:', { 
        hasUserInfo: !!userInfo, 
        hasItems: !!items, 
        isItemsArray: Array.isArray(items), 
        itemsLength: items?.length 
      })
      return NextResponse.json(
        { error: 'User information and items are required' },
        { status: 400 }
      )
    }

    if (!userInfo.name || !userInfo.email || !userInfo.phone || !userInfo.address || !userInfo.city || !userInfo.state || !userInfo.pincode) {
      console.error('Validation failed - incomplete user info:', {
        name: !!userInfo.name,
        email: !!userInfo.email,
        phone: !!userInfo.phone,
        address: !!userInfo.address,
        city: !!userInfo.city,
        state: !!userInfo.state,
        pincode: !!userInfo.pincode,
        userInfo: userInfo
      })
      return NextResponse.json(
        { error: 'All user information fields are required: name, email, phone, address, city, state, pincode' },
        { status: 400 }
      )
    }

    if (!subtotal || !total || isNaN(subtotal) || isNaN(total)) {
      return NextResponse.json(
        { error: 'Valid subtotal and total are required' },
        { status: 400 }
      )
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.name || !item.size || !item.color || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: 'Each item must have: productId, name, size, color, quantity, price' },
          { status: 400 }
        )
      }

      if (item.quantity < 1 || item.price < 0) {
        return NextResponse.json(
          { error: 'Item quantity must be at least 1 and price cannot be negative' },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(userInfo.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Validate phone format (10 digits)
    // const phoneRegex = /^[0-9]{10}$/
    // if (!phoneRegex.test(userInfo.phone)) {
    //   return NextResponse.json(
    //     { error: 'Please provide a valid 10-digit phone number' },
    //     { status: 400 }
    //   )
    // }

    // Validate pincode format (6 digits)
    // const pincodeRegex = /^[0-9]{6}$/
    // if (!pincodeRegex.test(userInfo.pincode)) {
    //   return NextResponse.json(
    //     { error: 'Please provide a valid 6-digit pincode' },
    //     { status: 400 }
    //   )
    // }

    // Verify products exist and are in stock
    const productIds = items.map(item => item.productId)
    const products = await Product.find({ _id: { $in: productIds } })
    
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products in the order were not found' },
        { status: 400 }
      )
    }

    // Check if all products are in stock
    // const outOfStockProducts = products.filter(product => !product.inStock)
    // if (outOfStockProducts.length > 0) {
    //   return NextResponse.json(
    //     { 
    //       error: 'Some products are out of stock',
    //       outOfStockProducts: outOfStockProducts.map(p => p.name)
    //     },
    //     { status: 400 }
    //   )
    // }

    // Find or create user
    let user = await User.findOne({ email: userInfo.email.toLowerCase() })
    
    if (!user) {
      // Create new user
      user = new User({
        name: userInfo.name.trim(),
        email: userInfo.email.toLowerCase().trim(),
        phone: userInfo.phone.trim(),
        address: userInfo.address.trim(),
        city: userInfo.city.trim(),
        state: userInfo.state.trim(),
        pincode: userInfo.pincode.trim()
      })
      await user.save()
    } else {
      // Update existing user information if provided
      user.name = userInfo.name.trim()
      user.phone = userInfo.phone.trim()
      user.address = userInfo.address.trim()
      user.city = userInfo.city.trim()
      user.state = userInfo.state.trim()
      user.pincode = userInfo.pincode.trim()
      await user.save()
    }

    // Create order
    const orderData = {
      user: user._id,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      })),
      subtotal: parseFloat(subtotal),
      shipping: parseFloat(shipping),
      tax: parseFloat(tax),
      total: parseFloat(total),
      paymentMethod: paymentMethod.toUpperCase(),
      shippingAddress: {
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city,
        state: userInfo.state,
        pincode: userInfo.pincode
      }
    }

    // Add Razorpay details if provided
    if (razorpayOrderId) orderData.razorpayOrderId = razorpayOrderId
    if (razorpayPaymentId) orderData.razorpayPaymentId = razorpayPaymentId
    if (razorpaySignature) orderData.razorpaySignature = razorpaySignature

    // Set payment status based on payment method and Razorpay details
    if (paymentMethod === 'RAZORPAY' && razorpayPaymentId) {
      orderData.paymentStatus = 'PAID'
      orderData.status = 'CONFIRMED'
    } else if (paymentMethod === 'COD') {
      orderData.paymentStatus = 'PENDING'
      orderData.status = 'CONFIRMED'
    }

    // Set estimated delivery (7 days from now)
    orderData.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const order = new Order(orderData)
    await order.save()

    // Populate order with user information for response
    await order.populate('user', 'name email phone address city state pincode')
    console.log('Order created successfully:', order)
    // Send email notifications (don't block the response if email fails)
    try {
      // Prepare order data for email
      const emailOrderData = {
        orderId: order.orderId,
        user: {
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
          address: order.shippingAddress.address,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode
        },
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }

      // Send emails asynchronously (don't wait for completion)
      Promise.all([
        sendOrderEmail('user', emailOrderData),
        sendOrderEmail('admin', emailOrderData)
      ]).then(([userEmailSent, adminEmailSent]) => {
        console.log(`Order ${order.orderId} emails sent - User: ${userEmailSent}, Admin: ${adminEmailSent}`)
      }).catch(error => {
        console.error(`Failed to send emails for order ${order.orderId}:`, error)
      })

    } catch (emailError) {
      // Log email error but don't fail the order creation
      console.error('Email notification error:', emailError)
      console.error('Email error details:', {
        message: emailError.message,
        stack: emailError.stack,
        orderData: {
          orderId: order.orderId,
          userEmail: order.user.email
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully. Email confirmations are being sent.',
      order: {
        id: order._id,
        orderId: order.orderId,
        user: {
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone
        },
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create order error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      )
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Order with this ID already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
