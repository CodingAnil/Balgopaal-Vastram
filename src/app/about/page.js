'use client'

import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { useState } from 'react'
import { showToast } from '@/components/ui/toast/notificationToast'
import AddProductForm from '@/components/admin/AddProductForm'

export default function AboutPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const handleGoToAdmin = () => {
    setShowPasswordModal(true)
    setAdminPassword('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: adminPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowPasswordModal(false)
        setShowAddProductForm(true)
        showToast('Welcome Admin!', 'success')
      } else {
        showToast(data.error || 'Invalid admin password', 'error')
        setAdminPassword('')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      showToast('Authentication failed. Please try again.', 'error')
      setAdminPassword('')
    }
  }

  const handleProductAdded = (product) => {
    showToast(`Product "${product.name}" added successfully!`, `success`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-peacock-copper-special py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              About Balgopaal Vastram
            </h1>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              Devotional wear for Laddu Gopal - Handcrafted with love in Haryana
              (India)
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Our Story
              </h2>
              <div className="space-y-4 leading-relaxed text-gray-600">
                <p>
                  Balgopaal Vastram was born from a deep devotion to Lord
                  Krishna and a passion for creating beautiful, authentic
                  devotional wear for Laddu Gopal. Based in the sacred city of
                  fatehabad, Haryana, we have been serving devotees across India
                  with handcrafted vastra, mukut, and bansuri for over a decade.
                </p>
                <p>
                  Our journey began when our founder, a lifelong devotee of
                  Krishna, noticed the lack of high-quality, authentic
                  devotional wear available for Laddu Gopal. Determined to fill
                  this gap, we started creating beautiful garments and
                  accessories using traditional techniques passed down through
                  generations.
                </p>
                <p>
                  Today, we are proud to be one of the most trusted names in
                  devotional wear, serving thousands of devotees who seek
                  authentic, beautiful, and high-quality products for their
                  beloved Laddu Gopal.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-peacock-400 to-copper-400">
                <div className="text-center text-white">
                  <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white/20">
                    <span className="text-6xl">
                      <img
                        src="/hero/standkrishna.jpg"
                        alt="Laddu Gopal"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">Made in Haryana</h3>
                  <p className="text-white/90">The Sacred City of Krishna</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              To provide devotees with authentic, beautiful, and high-quality
              devotional wear that brings joy to their Laddu Gopal and enhances
              their spiritual journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-peacock-100">
                <svg
                  className="h-8 w-8 text-peacock-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Authenticity
              </h3>
              <p className="text-gray-600">
                We use traditional techniques and authentic materials to create
                products that honor the rich heritage of devotional wear.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper-100">
                <svg
                  className="h-8 w-8 text-copper-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Quality
              </h3>
              <p className="text-gray-600">
                Every product is carefully crafted with attention to detail,
                ensuring durability and beauty that will last for years to come.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-peacock-100">
                <svg
                  className="h-8 w-8 text-peacock-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Devotion
              </h3>
              <p className="text-gray-600">
                Our work is driven by devotion and love for Krishna, ensuring
                that every product is created with pure intentions and spiritual
                purpose.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Handcrafted Excellence
              </h3>
              <p className="leading-relaxed text-gray-600">
                Every product is handcrafted by skilled artisans using
                traditional techniques. We believe in the beauty and
                authenticity that comes from human touch and attention to detail
                that machines cannot replicate.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Natural Materials
              </h3>
              <p className="leading-relaxed text-gray-600">
                We use only the finest natural materials - pure silk, cotton,
                and traditional fabrics. Our products are eco-friendly and safe
                for your beloved Laddu Gopal, ensuring comfort and authenticity.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Customer Satisfaction
              </h3>
              <p className="leading-relaxed text-gray-600">
                Your satisfaction is our priority. We provide detailed size
                guides, excellent customer service, and a 30-day return policy
                to ensure you are completely happy with your purchase.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Spiritual Connection
              </h3>
              <p className="leading-relaxed text-gray-600">
                We understand the deep spiritual connection between devotees and
                their Laddu Gopal. Our products are designed to enhance this
                sacred relationship and bring joy to your devotional practices.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Why Choose Balgopaal Vastram?
            </h2>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-peacock-50 to-copper-50 p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Award Winning
                </h3>
                <p className="text-sm text-gray-600">
                  Recognized for excellence in devotional wear
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Fast Delivery
                </h3>
                <p className="text-sm text-gray-600">
                  Quick and secure shipping across India
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Premium Quality
                </h3>
                <p className="text-sm text-gray-600">
                  Only the finest materials and craftsmanship
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <span className="text-2xl">🙏</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Devotional Focus
                </h3>
                <p className="text-sm text-gray-600">
                  Created with love and spiritual purpose
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Get in Touch
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600">
              Have questions about our products or need help choosing the right
              size? We're here to help you find the perfect devotional wear for
              your Laddu Gopal.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href={`/contact/`}
                className="btn-outline inline-flex items-center justify-center"
              >
                <svg
                  className="mr-2 h-5 w-5"
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
                Contact Us
              </Link>
              {/* <button
                onClick={handleGoToAdmin}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-copper-600 hover:bg-copper-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-copper-500 transition-colors"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                Go to Admin
              </button> */}
            </div>
          </div>
        </section>
      </div>

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin Access
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Enter Admin Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                    placeholder="Enter password"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-peacock-700 focus:outline-none focus:ring-2 focus:ring-peacock-500 focus:ring-offset-2"
                  >
                    Access Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      {showAddProductForm && (
        <AddProductForm
          onClose={() => setShowAddProductForm(false)}
          onSuccess={handleProductAdded}
        />
      )}
    </div>
  )
}
