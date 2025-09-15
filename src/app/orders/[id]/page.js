'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id)
    }
  }, [params.id])

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Order not found')
        toast.error(data.error || 'Order not found')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Failed to fetch order details')
      toast.error('Failed to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusSteps = (currentStatus) => {
    const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
    const currentIndex = statuses.indexOf(currentStatus)

    return statuses.map((status, index) => ({
      status,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-peacock-600"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <div className="mx-auto mb-4 h-12 w-12 text-red-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Order Not Found
            </h3>
            <p className="mb-4 text-gray-600">
              {error ||
                'The order you are looking for does not exist or could not be loaded.'}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                View All Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-peacock-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link
                  href="/orders"
                  className="text-gray-400 hover:text-gray-500"
                >
                  Orders
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    Order #{order.orderId}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderId}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:mt-0">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
              >
                Payment {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Progress */}
            {order.status !== 'CANCELLED' && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Order Progress
                </h2>
                <div className="flex items-center">
                  {statusSteps.map((step, stepIdx) => (
                    <div key={step.status} className="relative flex-1">
                      {stepIdx !== statusSteps.length - 1 && (
                        <div className="absolute left-4 top-4 -ml-px h-0.5 w-full bg-gray-200">
                          <div
                            className={`h-0.5 ${step.completed ? 'bg-peacock-600' : 'bg-gray-200'} transition-all duration-300`}
                            style={{ width: step.completed ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                      <div className="relative flex items-start">
                        <span className="flex h-9 items-center">
                          <span
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                              step.completed
                                ? 'border-peacock-600 bg-peacock-600'
                                : step.current
                                  ? 'border-peacock-600 bg-white'
                                  : 'border-gray-300 bg-white'
                            }`}
                          >
                            {step.completed ? (
                              <svg
                                className="h-5 w-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  step.current
                                    ? 'bg-peacock-600'
                                    : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </span>
                        </span>
                        <span className="ml-4 flex min-w-0 flex-col">
                          <span
                            className={`text-sm font-medium ${step.completed || step.current ? 'text-peacock-600' : 'text-gray-500'}`}
                          >
                            {step.status}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      {item.category && (
                        <span className="mt-1 inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPrice(item.price)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Shipping Address
              </h2>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.pincode}
                </p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Tracking Information
                </h2>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Tracking Number
                      </h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <code className="rounded bg-blue-100 px-2 py-1 text-xs">
                          {order.trackingNumber}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {order.shipping === 0
                      ? 'Free'
                      : formatPrice(order.shipping)}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Payment Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div>
                    <span className="text-gray-600">Payment ID</span>
                    <div className="mt-1">
                      <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                        {order.razorpayPaymentId}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-900">{order.user.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{order.user.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-900">{order.user.phone}</span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.estimatedDelivery && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Delivery Information
                </h2>
                <div className="text-sm">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <div className="mt-1 font-medium text-gray-900">
                    {formatDate(order.estimatedDelivery)}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/orders"
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                View All Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-peacock-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
