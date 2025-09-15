'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function OrdersPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    setSearched(false)

    try {
      const response = await fetch(
        `/api/orders/user/${encodeURIComponent(email)}?page=${currentPage}&limit=10`
      )
      const data = await response.json()

      if (response.ok && data.success) {
        setOrders(data.orders)
        setUser(data.user)
        setPagination(data.pagination)
        setSearched(true)

        if (data.orders.length === 0) {
          toast.info('No orders found for this email')
        } else {
          toast.success(`Found ${data.orders.length} order(s)`)
        }
      } else {
        toast.error(data.error || 'Failed to fetch orders')
        setOrders([])
        setUser(null)
        setSearched(true)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders. Please try again.')
      setOrders([])
      setUser(null)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (newPage) => {
    if (!email.trim() || newPage === currentPage) return

    setLoading(true)
    setCurrentPage(newPage)

    try {
      const response = await fetch(
        `/api/orders/user/${encodeURIComponent(email)}?page=${newPage}&limit=10`
      )
      const data = await response.json()

      if (response.ok && data.success) {
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders. Please try again.')
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
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">
            View your order history and track your devotional wear purchases
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="flex-1">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Enter your email address to view orders
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-md bg-peacock-600 px-6 py-2 font-medium text-white transition-colors hover:bg-peacock-700 focus:outline-none focus:ring-2 focus:ring-peacock-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Orders'}
              </button>
            </div>
          </form>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Customer Information
            </h2>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {searched && (
          <div>
            {orders.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-md">
                <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No Orders Found
                </h3>
                <p className="mb-4 text-gray-600">
                  We couldn't find any orders for this email address.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-peacock-700"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg bg-white p-6 shadow-md"
                  >
                    <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:mt-0">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-900">
                        Items ({order.items.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 rounded bg-gray-50 p-2"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Size {item.size} • {item.color} • Qty{' '}
                                {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center rounded bg-gray-50 p-2 text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex flex-col border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Total:</strong> {formatPrice(order.total)}
                        </p>
                        <p>
                          <strong>Payment:</strong> {order.paymentMethod}
                        </p>
                        {order.estimatedDelivery && (
                          <p>
                            <strong>Est. Delivery:</strong>{' '}
                            {formatDate(order.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between rounded-lg border-t border-gray-200 bg-white px-4 py-3 shadow-md sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrev || loading}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNext || loading}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page{' '}
                          <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">
                            {pagination.totalPages}
                          </span>{' '}
                          ({pagination.totalOrders} total orders)
                        </p>
                      </div>
                      <div>
                        <nav
                          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrev || loading}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="sr-only">Previous</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                            {currentPage}
                          </span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNext || loading}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="sr-only">Next</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
