'use client'

import { useState, useEffect } from 'react'
import { slides, perfectFor } from '@/lib/webContent/hero'

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative flex h-full items-center">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                  {/* Text Content */}
                  <div className="animate-fade-in-up space-y-6 text-white">
                    <div className="space-y-4">
                      <h1 className="text-shadow-lg text-4xl font-bold md:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="text-shadow text-xl text-gray-200 md:text-2xl">
                        {slide.subtitle}
                      </p>
                      <p className="max-w-lg text-lg text-gray-300">
                        {slide.description}
                      </p>
                    </div>
                    Color Swatches
                    {/* <div className="flex space-x-3">
                      {slide.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="h-12 w-12 rounded-full border-2 border-white"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div> */}
                    {/* CTA Button */}
                    {/* <div className="pt-4">
                      <Link href={slide.ctaLink}>
                        <Button
                          size="lg"
                          className="bg-white text-peacock-600 hover:bg-gray-100"
                        >
                          {slide.cta}
                        </Button>
                      </Link>
                    </div> */}
                  </div>

                  {/* Visual Elements */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Feature Cards */}
                      <div className="space-y-4">
                        <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-peacock-400 to-peacock-600">
                            <span className="text-xl text-white">🕉️</span>
                          </div>
                          <h3 className="font-semibold text-white">
                            Peacock Mukut
                          </h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-copper-400 to-copper-600">
                            <span className="text-xl text-white">🌿</span>
                          </div>
                          <h3 className="font-semibold text-white">
                            Natural Dress
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Perfect For Section */}
                    <div className="mt-8 rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                      <h4 className="mb-4 font-semibold text-white">
                        Perfect for:
                      </h4>
                      <ul className="space-y-2">
                        {perfectFor.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center text-white/90"
                          >
                            <div className="mr-3 flex h-6 w-6 items-center justify-center rounded bg-purple-500">
                              <span className="text-xs text-white">ॐ</span>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'scale-125 bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Auto-play Toggle */}
      {/* <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
        title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button> */}
    </section>
  )
}
