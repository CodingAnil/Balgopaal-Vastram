import { siteConfig } from '@/lib/config'

export const metadata = {
  title: 'Terms and Conditions - Balgopaal Vastram',
  description:
    'Terms and conditions for Balgopaal Vastram - Devotional wear for Laddu Gopal',
  keywords:
    'terms, conditions, policy, Balgopaal Vastram, Laddu Gopal, devotional wear',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-peacock-500 via-peacock-600 to-copper-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Terms and Conditions
            </h1>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="prose prose-lg max-w-none">
            <p className="mb-8 text-sm text-gray-600">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p className="mb-6 text-gray-700">
              By accessing and using Balgopaal Vastram website and services, you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. Use License
            </h2>
            <p className="mb-6 text-gray-700">
              Permission is granted to temporarily download one copy of the
              materials on Balgopaal Vastram's website for personal,
              non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may
              not:
            </p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                attempt to reverse engineer any software contained on the
                website
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              3. Product Information
            </h2>
            <p className="mb-6 text-gray-700">
              We strive to provide accurate product descriptions, images, and
              pricing information. However, we do not warrant that product
              descriptions or other content is accurate, complete, reliable,
              current, or error-free. Colors may appear differently depending on
              your device's display settings.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              4. Orders and Payment
            </h2>
            <p className="mb-6 text-gray-700">
              All orders are subject to acceptance by us. We reserve the right
              to refuse or cancel your order at any time for certain reasons
              including but not limited to: product or service availability,
              errors in the description or price of the product or service, or
              error in your order.
            </p>
            <p className="mb-6 text-gray-700">
              Payment must be received before we can process your order. We
              accept various payment methods as displayed during checkout. All
              prices are in Indian Rupees (INR) and are inclusive of applicable
              taxes.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              5. Shipping and Delivery
            </h2>
            <p className="mb-6 text-gray-700">
              We will make every effort to deliver your order within the
              estimated timeframe. However, delivery times are estimates and not
              guaranteed. We are not responsible for delays caused by shipping
              carriers or circumstances beyond our control.
            </p>
            <p className="mb-6 text-gray-700">
              Free shipping is available on orders above ₹999. Standard shipping
              charges apply for orders below this threshold.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              6. No Returns or Refunds Policy
            </h2>
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-800">
                <strong>IMPORTANT:</strong> All sales are final. We do not
                accept returns, exchanges, or provide refunds for any reason,
                including but not limited to:
              </p>
              <ul className="ml-4 mt-2 list-disc text-red-700">
                <li>Change of mind</li>
                <li>Incorrect size selection</li>
                <li>Product not meeting expectations</li>
                <li>Damaged items (unless damaged during shipping)</li>
                <li>Defective products</li>
              </ul>
              <p className="mt-2 text-red-800">
                Please ensure you have carefully reviewed the product details,
                size guide, and images before placing your order.
              </p>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              7. No Cash on Delivery (COD)
            </h2>
            <p className="mb-6 text-gray-700">
              We do not offer Cash on Delivery (COD) payment option. All orders
              must be paid for in advance using the available online payment
              methods.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              8. Limitation of Liability
            </h2>
            <p className="mb-6 text-gray-700">
              In no event shall Balgopaal Vastram, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your use of
              the service.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              9. Privacy Policy
            </h2>
            <p className="mb-6 text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the service, to understand our
              practices.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              10. Governing Law
            </h2>
            <p className="mb-6 text-gray-700">
              These terms shall be interpreted and governed by the laws of
              India. Any disputes relating to these terms will be subject to the
              exclusive jurisdiction of the courts of Mathura, Uttar Pradesh,
              India.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              11. Changes to Terms
            </h2>
            <p className="mb-6 text-gray-700">
              We reserve the right, at our sole discretion, to modify or replace
              these terms at any time. If a revision is material, we will try to
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              12. Contact Information
            </h2>
            <p className="mb-6 text-gray-700">
              If you have any questions about these Terms and Conditions, please
              contact us:
            </p>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> {siteConfig.contact.email}
                <br />
                <strong>Phone:</strong> {siteConfig.contact.phone}
                <br />
                <strong>Address:</strong> {siteConfig.contact.address}
              </p>
            </div>

            <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> By placing an order with us, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions, including our no
                returns/refunds policy and no COD policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
