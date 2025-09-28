'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/config'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const faqs = [
    {
      question: 'How do I choose the right size for my Laddu Gopal?',
      answer:
        "We provide a detailed size guide on our website. Measure your Laddu Gopal's height from head to toe and refer to our size chart. Each size includes specific measurements for height and diameter to ensure a perfect fit. If you're unsure, you can contact us for personalized sizing assistance.",
    },
    {
      question: 'What materials are used in your products?',
      answer:
        'Our products are made with high-quality materials including pure silk, cotton, and traditional fabrics. The vastra (dresses) feature intricate embroidery and traditional work, while our mukut (crowns) are crafted from copper, brass, and other premium materials. All products are handcrafted with love and attention to detail.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Standard shipping takes 3-5 business days within India. We also offer express shipping for faster delivery. Free shipping is available on orders above ₹999. International shipping may take 7-14 business days depending on the destination.',
    },
    {
      question: 'Do you offer custom orders?',
      answer:
        'Yes! We specialize in custom vastra and mukut designs. You can contact us with your specific requirements, including size, color preferences, and design details. Custom orders typically take 7-10 business days to complete and may have additional charges.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, debit cards, UPI payments, net banking, and digital wallets. All payments are processed securely through our payment gateway. Please note that we do not offer Cash on Delivery (COD) payment option.',
    },
    {
      question: 'Can I track my order?',
      answer:
        "Yes, once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status in real-time through our website or the shipping carrier's website.",
    },
    {
      question: 'What is your return and refund policy?',
      answer:
        'We have a strict no returns and no refunds policy. All sales are final. Please ensure you have carefully reviewed the product details, size guide, and images before placing your order. We recommend double-checking measurements and contacting us if you have any questions before purchasing.',
    },
    {
      question: 'How do I care for my devotional wear?',
      answer:
        'For vastra (dresses), we recommend gentle hand washing with mild detergent and air drying. Avoid machine washing and ironing. For mukut (crowns), clean with a soft cloth and store in a dry place. Avoid exposure to moisture and direct sunlight to maintain the quality and appearance.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        "Yes, we ship to most countries worldwide. International shipping charges apply and delivery times may vary by destination (7-14 business days). Please note that customs duties and taxes may apply in your country, which are the customer's responsibility.",
    },
    {
      question: 'What if my order is damaged during shipping?',
      answer:
        'If your order arrives damaged due to shipping, please contact us immediately with photos of the damaged items and packaging. We will investigate the issue and provide appropriate resolution, which may include replacement or compensation, depending on the circumstances.',
    },
    {
      question: 'How can I contact customer support?',
      answer: `You can reach our customer support team through multiple channels: Email us at ${siteConfig.contact.email}, call us at ${siteConfig.contact.phone}, or WhatsApp us for quick responses. Our support team is available Monday to Saturday, 9:00 AM to 7:00 PM IST.`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-peacock-copper-special py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              Find answers to common questions about our products and services
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg bg-white shadow-md">
              <button
                className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-gray-50"
                onClick={() => toggleItem(index)}
              >
                <h3 className="pr-4 text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      openItems[index] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {openItems[index] && (
                <div className="border-t border-gray-200 px-6 pb-6 pt-4">
                  <p className="leading-relaxed text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-yellow-800">
            Important Notice
          </h3>
          <div className="space-y-2 text-yellow-700">
            <p>
              • <strong>No Returns/Refunds:</strong> All sales are final. Please
              review product details carefully before ordering.
            </p>
            <p>
              • <strong>No COD:</strong> We do not offer Cash on Delivery.
              Payment must be made in advance.
            </p>
            <p>
              • <strong>Custom Orders:</strong> Available with additional
              processing time and charges.
            </p>
            <p>
              • <strong>Size Guide:</strong> Please refer to our size guide for
              accurate measurements.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 rounded-lg bg-white p-8 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Still have questions?
          </h3>
          <p className="mb-6 text-gray-700">
            If you couldn't find the answer you're looking for, our customer
            support team is here to help!
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-peacock-100">
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Email Us</h4>
              <p className="text-sm text-gray-600">
                {siteConfig.contact.email}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-copper-100">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Call Us</h4>
              <p className="text-sm text-gray-600">
                {siteConfig.contact.phone}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">WhatsApp</h4>
              <p className="text-sm text-gray-600">Quick responses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
