import { NextResponse } from 'next/server'
import { sendOrderEmail } from '@/lib/utils/sendEmail'

export async function POST(request) {
  try {
    let type = 'user'

    // Sample order data for testing
    const sampleOrderData = {
      orderId: `TEST-${Date.now()}`,
      user: {
        name: 'Test Customer',
        email: 'customer@example.com', // Change this to your test email
        phone: '9876543210',
        address: '123 Test Street, Test Area',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        pincode: '281001',
      },
      items: [
        {
          name: 'Blue Silk Vastra',
          size: '2',
          color: 'Blue',
          quantity: 1,
          price: 500,
        },
        {
          name: 'Golden Crown Mukut',
          size: '3',
          color: 'Gold',
          quantity: 2,
          price: 750,
        },
      ],
      subtotal: 2000,
      shipping: 0,
      tax: 0,
      total: 2000,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    }

    // Send test email
    const emailSent = await sendOrderEmail(type, sampleOrderData)

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: `Test ${type} email sent successfully`,
        orderId: sampleOrderData.orderId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send test ${type} email`,
          orderId: sampleOrderData.orderId,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
