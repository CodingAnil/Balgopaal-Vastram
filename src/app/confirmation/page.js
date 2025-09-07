'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { clearCart } from '@/lib/cart'
import Button from '@/components/ui/button'
import { siteConfig } from '@/lib/config'
import { showToast } from '@/components/ui/toast/notificationToast'

export default function ConfirmationPage() {
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder')
    if (lastOrder) {
      setOrderData(JSON.parse(lastOrder))
      // Clear cart after successful order
      clearCart()
    } else {
      // Redirect to home if no order data
      window.location.href = '/'
    }
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
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

  const handleAdminNotification = () => {

    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(orderData)

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/${siteConfig.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')

    // Show success message
    showToast('Admin notification sent!', 'success')
  }

  if (!orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-peacock-600"></div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="mb-2 text-lg text-gray-600">
            Thank you for your order. Please send the purchase details to Admin, so that we start your order shipping.
          </p>
          <p className="text-gray-600">
            Order ID:{' '}
            <span className="font-semibold text-peacock-600">
              {orderData.orderId}
            </span>
          </p>
          <p className="text-gray-600"><span className='font-semibold text-red-500'>NOTE :</span>Its an required action please send the message to admin</p>
          <button onClick={handleAdminNotification} className="bg-peacock-600 text-white px-4 py-2 rounded-md">
            Send Notification to Admin
          </button>
        </div>

        {/* Order Details */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Order Details
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Customer Information */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{orderData.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {orderData.customer.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {orderData.customer.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-right font-medium">
                    {orderData.customer.address}
                    <br />
                    {orderData.customer.city}, {orderData.customer.state} -{' '}
                    {orderData.customer.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(orderData.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{orderData.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatPrice(orderData.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {orderData.shipping === 0
                      ? 'Free'
                      : formatPrice(orderData.shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(orderData.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Order Items
          </h2>

          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = '/hero/peckok.jpeg'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Color: {item.color} | Quantity:{' '}
                    {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-peacock-50 to-copper-50 p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            What's Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-peacock-500 text-sm font-medium text-white">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Payment Confirmation
                </h3>
                <p className="text-sm text-gray-600">
                  Complete your payment via UPI/QR code as instructed in
                  WhatsApp. Our team will confirm your payment within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-copper-500 text-sm font-medium text-white">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  Once payment is confirmed, we'll start preparing your order.
                  Processing time: 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-peacock-500 text-sm font-medium text-white">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Shipping & Delivery
                </h3>
                <p className="text-sm text-gray-600">
                  Your order will be shipped within 2-3 business days. You'll
                  receive tracking information via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Need Help?
          </h2>
          <p className="mb-4 text-gray-600">
            If you have any questions about your order, please don't hesitate to
            contact us:
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peacock-500">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-sm text-gray-600">{siteConfig.contact.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-copper-500">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">
                  info@balgopaal-vastram.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
