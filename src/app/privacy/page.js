import { siteConfig } from '@/lib/config'

export const metadata = {
  title: 'Privacy Policy - Balgopaal Vastram',
  description: 'Privacy policy for Balgopaal Vastram - How we collect, use, and protect your personal information',
  keywords: 'privacy, policy, data protection, Balgopaal Vastram, personal information',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-peacock-500 via-peacock-600 to-copper-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Introduction</h2>
            <p className="mb-6 text-gray-700">
              At Balgopaal Vastram, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            
            <h3 className="mb-3 text-xl font-semibold text-gray-900">2.1 Personal Information</h3>
            <p className="mb-4 text-gray-700">We may collect the following types of personal information:</p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Account information (username, password)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-gray-900">2.2 Automatically Collected Information</h3>
            <p className="mb-4 text-gray-700">We automatically collect certain information when you visit our website:</p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            <p className="mb-4 text-gray-700">We use the collected information for the following purposes:</p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>Process and fulfill your orders</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Information Sharing and Disclosure</h2>
            <p className="mb-4 text-gray-700">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            
            <h3 className="mb-3 text-xl font-semibold text-gray-900">4.1 Service Providers</h3>
            <p className="mb-4 text-gray-700">We may share your information with trusted third-party service providers who assist us in:</p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>Payment processing</li>
              <li>Shipping and delivery</li>
              <li>Website hosting and maintenance</li>
              <li>Email marketing services</li>
              <li>Analytics and performance monitoring</li>
            </ul>

            <h3 className="mb-3 text-xl font-semibold text-gray-900">4.2 Legal Requirements</h3>
            <p className="mb-6 text-gray-700">
              We may disclose your information if required by law or in response to valid legal requests from government authorities or law enforcement agencies.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Data Security</h2>
            <p className="mb-6 text-gray-700">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Cookies and Tracking Technologies</h2>
            <p className="mb-4 text-gray-700">We use cookies and similar tracking technologies to:</p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve website functionality and user experience</li>
            </ul>
            <p className="mb-6 text-gray-700">
              You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Third-Party Links</h2>
            <p className="mb-6 text-gray-700">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">8. Data Retention</h2>
            <p className="mb-6 text-gray-700">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">9. Your Rights and Choices</h2>
            <p className="mb-4 text-gray-700">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="mb-6 ml-6 list-disc text-gray-700">
              <li>Access and obtain a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">10. Children's Privacy</h2>
            <p className="mb-6 text-gray-700">
              Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">11. International Data Transfers</h2>
            <p className="mb-6 text-gray-700">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">12. Changes to This Privacy Policy</h2>
            <p className="mb-6 text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
            </p>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">13. Contact Us</h2>
            <p className="mb-6 text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> {siteConfig.contact.email}<br />
                <strong>Phone:</strong> {siteConfig.contact.phone}<br />
                <strong>Address:</strong> {siteConfig.contact.address}
              </p>
            </div>

            <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> This Privacy Policy is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
