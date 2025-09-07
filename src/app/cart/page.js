'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
  getCartItemCount,
  clearCart,
} from '@/lib/cart'
import { siteConfig } from '@/lib/config'
import Button from '@/components/ui/button'

export default function CartPage() {
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCart = () => {
      const cartData = getCart()
      setCart(cartData)
      setIsLoading(false)
    }

    loadCart()

    // Listen for storage changes
    window.addEventListener('storage', loadCart)

    return () => {
      window.removeEventListener('storage', loadCart)
    }
  }, [])

  const handleQuantityChange = (itemId, size, color, newQuantity) => {
    const updatedCart = updateCartItemQuantity(itemId, size, color, newQuantity)
    setCart(updatedCart)
  }

  const handleRemoveItem = (itemId, size, color) => {
    const updatedCart = removeFromCart(itemId, size, color)
    setCart(updatedCart)
  }

  const handleClearCart = () => {
    const updatedCart = clearCart()
    setCart(updatedCart)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = getCartTotal(cart)
  const shippingCost =
    subtotal >= siteConfig.shipping.freeShippingThreshold
      ? 0
      : siteConfig.shipping.standardShipping
  const total = subtotal + shippingCost

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-peacock-600"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>
            <p className="mb-8 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {getCartItemCount(cart)} item
            {getCartItemCount(cart) !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-md">
              <div className="p-6">
                <h2 className="mb-6 text-lg text-space-between font-semibold text-gray-900">
                  Cart Items  <span className="text-sm text-gray-500">Total Items: ({cart.length}) </span>  
                  <button onClick={handleClearCart} className="text-sm text-red-500">Clear All</button>
                </h2>
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4"
                    >
                      {/* Product Image */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/hero/peckok.jpeg'
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span>Size: {item.size}</span>
                          <span>Color: {item.color}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          handleRemoveItem(item.id, item.size, item.color)
                        }
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Remove item"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white shadow-md">
              <div className="p-6">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                    </span>
                  </div>

                  {/* Free Shipping Notice */}
                  {shippingCost > 0 && (
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

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="mt-6">
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>

                {/* Continue Shopping */}
                <div className="mt-4">
                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure checkout
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      30-day return policy
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Free shipping on orders above ₹999
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
