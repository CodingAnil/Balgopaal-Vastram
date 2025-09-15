'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getCart,
  getCartTotal,
  getCartItemCount,
  getShippingCost,
  getCartTotalWithShipping,
} from '@/lib/cart'
import { siteConfig } from '@/lib/config'
import Button from '@/components/ui/button'
import Link from 'next/link'
import { showToast } from '@/components/ui/toast/notificationToast'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  useEffect(() => {
    const cartData = getCart()
    if (cartData.length === 0) {
      router.push('/cart')
      return
    }
    setCart(cartData)
  }, [router])

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          setRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => {
          console.error('Failed to load Razorpay script')
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    loadRazorpay()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  const createRazorpayOrder = async (amount) => {
    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Razorpay order')
      }

      return data.order
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed')
      }

      return data.payment
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.warn('Failed to save order to database:', data.error)
        // Don't throw error as we don't want to break the payment flow
        return null
      }

      return data
    } catch (error) {
      console.error('Error saving order to database:', error)
      // Don't throw error as we don't want to break the payment flow
      return null
    }
  }

  const handleRazorpayPayment = async (orderData) => {
    if (!window.Razorpay) {
      throw new Error('Razorpay not loaded')
    }

    // Check if Razorpay key is available
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!razorpayKey || razorpayKey === 'your_razorpay_key_id_here') {
      throw new Error(
        'Razorpay key not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local'
      )
    }

    const razorpayOrder = await createRazorpayOrder(orderData.total)

    const options = {
      key: razorpayKey,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Balgopaal Vastram',
      description: `Order ${orderData.orderId}`,
      order_id: razorpayOrder.id,
      prefill: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        contact: orderData.customer.phone,
      },
      notes: {
        order_id: orderData.orderId,
        customer_name: orderData.customer.name,
      },
      theme: {
        color: '#059669', // Peacock green color
      },
      handler: async function (response) {
        try {
          // Verify payment
          const payment = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })

          // Save order to database
          const dbOrder = await saveOrderToDatabase({
            userInfo: orderData.customer,
            items: orderData.items.map((item) => ({
              productId: item.id || item.productId,
              name: item.name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            total: orderData.total,
            paymentMethod: 'RAZORPAY',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })

          // Update order data with payment info and database details
          const updatedOrderData = {
            ...orderData,
            dbOrderId: dbOrder?.order?.id,
            dbOrderNumber: dbOrder?.order?.orderId,
            payment: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              method: payment.method,
            },
            status: 'paid',
          }

          // Store order in localStorage for confirmation page
          localStorage.setItem('lastOrder', JSON.stringify(updatedOrderData))

          // Create WhatsApp message
          const whatsappMessage = createWhatsAppMessage(updatedOrderData)

          // Open WhatsApp with the message
          const whatsappUrl = `https://wa.me/${siteConfig.payment.whatsapp.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`
          window.open(whatsappUrl, '_blank')

          // Show success message
          showToast(
            'Payment successful! Redirecting to confirmation...',
            'success'
          )

          // Redirect to confirmation page
          setTimeout(() => {
            router.push('/confirmation')
          }, 2000)
        } catch (error) {
          console.error('Payment verification failed:', error)
          showToast(
            'Payment verification failed. Please contact support.',
            'error'
          )
        }
      },
      modal: {
        ondismiss: function () {
          showToast('Payment cancelled', 'info')
          setIsProcessing(false)
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  const handleWhatsAppPayment = async (orderData) => {
    try {
      // Save order to database (COD method)
      const dbOrder = await saveOrderToDatabase({
        userInfo: orderData.customer,
        items: orderData.items.map((item) => ({
          productId: item.id || item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        paymentMethod: 'COD',
      })

      // Update order data with database details
      const updatedOrderData = {
        ...orderData,
        dbOrderId: dbOrder?.order?.id,
        dbOrderNumber: dbOrder?.order?.orderId,
        paymentMethod: 'COD',
      }

      // Create WhatsApp message
      const whatsappMessage = createWhatsAppMessage(updatedOrderData)

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${siteConfig.payment.whatsapp.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')

      // Store order in localStorage for confirmation page
      localStorage.setItem('lastOrder', JSON.stringify(updatedOrderData))

      // Show success message
      showToast('Order details sent to WhatsApp!', 'success')

      // Redirect to confirmation page
      setTimeout(() => {
        router.push('/confirmation')
      }, 2000)
    } catch (error) {
      console.error('Error processing WhatsApp order:', error)
      showToast(
        'There was an error processing your order. Please try again.',
        'error'
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (paymentMethod === 'razorpay' && !razorpayLoaded) {
      showToast('Payment system is loading. Please wait...', 'info')
      return
    }

    setIsProcessing(true)

    try {
      // Generate order ID
      const orderId = `BV${Date.now()}`

      // Calculate totals
      const subtotal = getCartTotal(cart)
      const shipping = getShippingCost(cart, siteConfig)
      const total = getCartTotalWithShipping(cart, siteConfig)

      // Prepare order data
      const orderData = {
        orderId,
        customer: customerInfo,
        items: cart,
        subtotal,
        shipping,
        total,
        date: new Date().toISOString(),
        status: 'pending',
      }

      // Handle payment based on selected method
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(orderData)
      } else {
        await handleWhatsAppPayment(orderData)
      }
    } catch (error) {
      console.error('Error processing order:', error)

      // Show specific error messages
      if (error.message.includes('Razorpay key not configured')) {
        showToast(
          'Payment system not configured. Please contact support.',
          'error'
        )
      } else if (error.message.includes('Razorpay not loaded')) {
        showToast(
          'Payment system failed to load. Please refresh the page.',
          'error'
        )
      } else {
        showToast(
          'There was an error processing your order. Please try again.',
          'error'
        )
      }

      setIsProcessing(false)
    }
  }

  const createWhatsAppMessage = (orderData) => {
    let message = `🛍️ *New Order - Balgopaal Vastram*\n\n`
    message += `*Order ID:* ${orderData.orderId}\n`
    message += `*Date:* ${new Date(orderData.date).toLocaleDateString('en-IN')}\n`
    message += `*Status:* ${orderData.status === 'paid' ? '✅ PAID' : '⏳ Pending'}\n\n`

    message += `*Customer Details:*\n`
    message += `Name: ${orderData.customer.name}\n`
    message += `Email: ${orderData.customer.email}\n`
    message += `Phone: ${orderData.customer.phone}\n`
    message += `Address: ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.pincode}\n\n`

    message += `*Order Items:*\n`
    orderData.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Size: ${item.size}, Color: ${item.color}\n`
      message += `   Quantity: ${item.quantity}\n`
      message += `   Price: ₹${item.price * item.quantity}\n\n`
    })

    message += `*Order Summary:*\n`
    message += `Subtotal: ₹${orderData.subtotal}\n`
    message += `Shipping: ${orderData.shipping === 0 ? 'Free' : `₹${orderData.shipping}`}\n`
    message += `*Total: ₹${orderData.total}*\n\n`

    if (orderData.payment) {
      message += `*Payment Details:*\n`
      message += `Payment ID: ${orderData.payment.razorpay_payment_id}\n`
      message += `Method: ${orderData.payment.method || 'Razorpay'}\n`
      message += `Status: ${orderData.payment.status}\n\n`
    }

    message += `Please process this order for shipping. Thank you! 🙏`

    return message
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-peacock-600"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal(cart)
  const shipping = getShippingCost(cart, siteConfig)
  const total = getCartTotalWithShipping(cart, siteConfig)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">
            Complete your order for devotional wear
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Customer Information */}
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={customerInfo.pincode}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input-field"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your state"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div className="rounded-lg border border-peacock-200 bg-peacock-50 p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={handlePaymentMethodChange}
                        className="h-4 w-4 border-gray-300 text-peacock-600 focus:ring-peacock-500"
                      />
                      <label
                        htmlFor="razorpay"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Razorpay Payment Gateway
                      </label>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Secure payment via UPI, Cards, Net Banking, Wallets
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Secure & Encrypted Payment
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Your payment information is secure and encrypted. We never
                    store your card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="mb-6 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex items-center space-x-3"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/hero/peckok.jpeg'
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Size: {item.size} | Color: {item.color} | Qty:{' '}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="rounded-lg border border-peacock-200 bg-peacock-50 p-3">
                      <p className="text-sm text-peacock-700">
                        Add{' '}
                        {formatPrice(
                          siteConfig.shipping.freeShippingThreshold - subtotal
                        )}{' '}
                        more for free shipping!
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mt-6">
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <input
                      type="checkbox"
                      name="termsAndConditions"
                      id="termsAndConditions"
                      required
                    />
                    <span>
                      accept our{' '}
                      <Link href="/terms" className="text-blue-500">
                        terms and conditions
                      </Link>
                    </span>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing
                    ? 'Processing...'
                    : paymentMethod === 'razorpay'
                      ? 'Place Order & Pay Securely'
                      : 'Place Order & Pay via WhatsApp'}
                </Button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  By placing this order, you agree to our terms and conditions.
                  {paymentMethod === 'razorpay'
                    ? ' Payment will be processed securely via Razorpay.'
                    : ' You will be redirected to WhatsApp to complete the payment.'}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
