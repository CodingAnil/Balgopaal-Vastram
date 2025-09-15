'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import Button from './button'

export default function SizeGuideModal({ isModalOpen, onClose }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    setIsOpen(isModalOpen)
  }, [isModalOpen])

  return (
    <>
      {/* Floating Size Guide Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpen}
          className="group relative transform rounded-full bg-gradient-to-r from-peacock-500 to-copper-500 p-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          title="Check your Laddu Gopal size and their dress size"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Check your Laddu Gopal size and their dress size
            <div className="absolute right-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            ></div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-peacock-500 to-copper-500">
                      <span className="text-lg font-bold text-white">BV</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Know Your Laddu Gopal Size
                      </h3>
                      {/* <p className="text-sm text-gray-600">maha SHRINGAR</p> */}
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                  >
                    <svg
                      className="h-6 w-6"
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

                {/* Size Guide Content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Idol Size Section */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                        <img
                          src="/hero/gopalSize.png"
                          alt="Laddu Gopal Idol"
                          className="h-full w-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/hero/peckok.jpeg'
                          }}
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Idol Size
                      </h4>
                      <p className="text-sm text-gray-600">
                        Measure your Laddu Gopal's height
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <h5 className="mb-3 font-medium text-gray-900">
                        Idol Height to Dress Size
                      </h5>
                      <div className="space-y-2">
                        {siteConfig.sizes.map((size) => (
                          <div
                            key={size.id}
                            className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {size.height}
                            </span>
                            <span className="text-sm font-semibold text-peacock-600">
                              Dress Size {size.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dress Size Section */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-peacock-500 to-copper-500">
                        <img
                          src="/hero/gopalSizeDress.jpeg"
                          alt="Laddu Gopal Dress"
                          className="h-full w-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/hero/peckok.jpeg'
                          }}
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Dress Size
                      </h4>
                      <p className="text-sm text-gray-600">
                        Measure the dress diameter
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <h5 className="mb-3 font-medium text-gray-900">
                        Dress Diameter to Size
                      </h5>
                      <div className="space-y-2">
                        {siteConfig.sizes.map((size) => (
                          <div
                            key={size.id}
                            className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {size.diameter}
                            </span>
                            <span className="text-sm font-semibold text-copper-600">
                              Size {size.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Section */}
                <div className="mt-8 rounded-lg bg-gradient-to-r from-peacock-50 to-copper-50 p-6">
                  <h4 className="mb-4 text-center text-lg font-semibold text-gray-900">
                    Example
                  </h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Idol Height: 2.75 inch
                      </p>
                      <p className="text-sm font-semibold text-peacock-600">
                        → Dress Size 2
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Dress Diameter: 6.0 inch
                      </p>
                      <p className="text-sm font-semibold text-copper-600">
                        → Size 2
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h5 className="mb-2 font-medium text-yellow-800">
                    💡 Pro Tips
                  </h5>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>
                      • Measure your Laddu Gopal from head to toe for accurate
                      sizing
                    </li>
                    <li>
                      • For dresses, measure the widest part of the garment
                    </li>
                    <li>
                      • If between sizes, choose the larger size for comfort
                    </li>
                    <li>• Contact us if you need help with sizing</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                  onClick={handleClose}
                  className="w-full sm:ml-3 sm:w-auto"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
