import Razorpay from 'razorpay'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    // Create signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment verification failed - Invalid signature' 
        },
        { status: 400 }
      )
    }

    // Initialize Razorpay inside the function to avoid build-time issues
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id)

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        order_id: razorpay_order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at,
      },
    })
  } catch (error) {
    console.error('Razorpay payment verification error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Payment verification failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
