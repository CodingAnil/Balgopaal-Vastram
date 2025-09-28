'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/config'
import Button from '@/components/ui/button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Validate required fields
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim() ||
        !formData.message.trim()
      ) {
        setSubmitStatus('error')
        setIsSubmitting(false)
        return
      }

      // Format the message
      const formattedMessage = `New Contact Request:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject || 'Not specified'}
Message: ${formData.message}`

      // Encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(formattedMessage)

      // WhatsApp phone number from config
      const whatsappNumber = siteConfig.contact.phone.replace(/\D/g, '') // Remove non-digits

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      // Open WhatsApp in a new tab/window
      window.open(whatsappUrl, '_blank')

      // Reset form after successful redirect
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })

      setSubmitStatus('success')
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-peacock-copper-special py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Contact Us</h1>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              We're here to help you find the perfect devotional wear for your
              Laddu Gopal
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Get in Touch
              </h2>
              <p className="mb-8 leading-relaxed text-gray-600">
                Have questions about our products, need help with sizing, or
                want to place a custom order? We're here to help! Reach out to
                us through any of the channels below.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-peacock-100">
                  <svg
                    className="h-6 w-6 text-peacock-600"
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
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">{siteConfig.contact.phone}</p>
                  <p className="text-sm text-gray-500">
                    Mon-Sat: 9:00 AM - 7:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-copper-100">
                  <svg
                    className="h-6 w-6 text-copper-600"
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
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">{siteConfig.contact.email}</p>
                  <p className="text-sm text-gray-500">
                    We respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-peacock-100">
                  <svg
                    className="h-6 w-6 text-peacock-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address
                  </h3>
                  <p className="text-gray-600">{siteConfig.contact.address}</p>
                  <p className="text-sm text-gray-500">
                    Visit us by appointment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    WhatsApp
                  </h3>
                  <p className="text-gray-600">{siteConfig.contact.phone}</p>
                  <p className="text-sm text-gray-500">
                    Quick responses for orders
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Send us a Message
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Fill out the form below and we'll redirect you to WhatsApp to send
              your message directly to us.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-700">
                    Redirecting to WhatsApp... Please send your message there.
                  </span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700">
                    Please fill in all required fields (Name, Email, Phone, and
                    Message).
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="sizing-help">Sizing Help</option>
                    <option value="custom-order">Custom Order</option>
                    <option value="order-status">Order Status</option>
                    <option value="return-exchange">Return/Exchange</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input-field"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
