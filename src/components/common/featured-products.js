'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ui/product-card'

export default function FeaturedProducts({ products = [] }) {
  if (!products || products.length === 0) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Featured Products
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              No featured products available. Add some products via the admin
              panel!
            </p>
            <div className="mt-4">
              <a
                href="/admin"
                className="inline-block rounded-lg bg-peacock-600 px-6 py-2 text-white transition-colors hover:bg-peacock-700"
              >
                Go to Admin Panel
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Featured Products
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Handpicked devotional wear for your Laddu Gopal, featuring our most
            popular items
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/products">
            <button className="transform rounded-lg bg-gradient-to-r from-peacock-500 to-copper-500 px-8 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
