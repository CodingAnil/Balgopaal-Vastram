'use client'

import { useState, useEffect } from 'react'
import { testimonials } from '@/lib/webContent/teastmonial'

export default function Testimonials() {
  const [currentTestimonials, setCurrentTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Function to get 3 random testimonials
  const getRandomTestimonials = () => {
    const shuffled = [...testimonials].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  // Manual refresh function
  const refreshTestimonials = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentTestimonials(getRandomTestimonials())
      setIsLoading(false)
    }, 300)
  }

  // Initialize with first 3 testimonials
  useEffect(() => {
    setCurrentTestimonials(testimonials.slice(0, 3))
  }, [])

  // Rotate testimonials every 3 minutes (180000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true)
      setTimeout(() => {
        setCurrentTestimonials(getRandomTestimonials())
        setIsLoading(false)
      }, 300)
    }, 180000) // 3 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about our products.
          </p>
        </div>

        {/* Testimonials Grid - Show only 3 at a time */}
        <div
          className={`grid grid-cols-1 gap-8 transition-opacity duration-300 md:grid-cols-2 lg:grid-cols-3 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        >
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg bg-gray-50 p-6 transition-all duration-500 hover:shadow-lg"
              style={{
                animation: 'fadeIn 0.5s ease-in-out',
              }}
            >
              {/* Rating */}
              <div className="mb-4 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(testimonial.rating)
                        ? 'text-yellow-400'
                        : i < testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                    }`}
                    fill={i < testimonial.rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Testimonial Text */}
              <blockquote className="mb-6 leading-relaxed text-gray-700">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-peacock-400 to-copper-400">
                  <span className="text-lg font-semibold text-white">
                    {testimonial.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rotation Indicator */}
        {/* <div className="mt-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-peacock-400 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-peacock-300"></div>
                <div className="h-2 w-2 rounded-full bg-peacock-200"></div>
              </div>
              <span>Reviews rotate every 3 minutes</span>
            </div>
            <button
              onClick={refreshTestimonials}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-peacock-600 bg-peacock-50 rounded-lg hover:bg-peacock-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Loading...' : 'Show More Reviews'}
            </button>
          </div>
        </div> */}

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-peacock-600">
                1000+
              </div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-copper-600">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-peacock-600">
                2000+
              </div>
              <div className="text-sm text-gray-600">Products Sold</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-copper-600">15+</div>
              <div className="text-sm text-gray-600">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
