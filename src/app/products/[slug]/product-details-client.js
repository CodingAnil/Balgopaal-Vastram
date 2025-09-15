'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { addToCart } from '@/lib/cart'
import { toggleFavorite, isFavorite } from '@/lib/favorites'
import { siteConfig } from '@/lib/config'
import Button from '@/components/ui/button'
import SizeGuideModal from '@/components/ui/size-guide-modal'
import { showToast } from '@/components/ui/toast/notificationToast'
import { useRouter } from 'next/navigation'
import RelatedProducts from '@/components/common/related-products'

export default function ProductDetailsClient({ product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const router = useRouter()
  // Initialize default selections
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0])
    }
    setIsFavorited(isFavorite(product.id || product._id))

    // Listen for favorite changes across the app
    const handleFavoriteChange = (e) => {
      if (
        e.detail &&
        (e.detail.productId === product.id ||
          e.detail.productId === product._id)
      ) {
        setIsFavorited(isFavorite(product.id || product._id))
      }
    }

    window.addEventListener('favoriteChanged', handleFavoriteChange)

    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange)
    }
  }, [product])

  const handleAddToCart = async () => {
    if (isAddingToCart) {
      router.push('/cart')
      return
    }
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color')
      return
    }

    setIsAddingToCart(true)
    try {
      addToCart(product, selectedSize, selectedColor, quantity)
      console.log('Added to cart successfully')
      showToast('Added to cart', 'success')
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      // setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = () => {
    const productId = product.id || product._id
    const newFavorites = toggleFavorite(product)
    const wasAdded = !isFavorited

    if (wasAdded) {
      showToast('Added to favorites', 'success')
    } else {
      showToast('Removed from favorites', 'info')
    }

    setIsFavorited(wasAdded)

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent('favoriteChanged', {
        detail: { productId, wasAdded },
      })
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    }
    return 0
  }

  const getColorInfo = (colorId) => {
    const configColor = siteConfig.colors.find((c) => c.id === colorId)
    if (configColor) {
      return configColor
    }

    // Fallback for colors not in config
    return {
      id: colorId,
      name:
        colorId.charAt(0).toUpperCase() + colorId.slice(1).replace('-', ' '),
      value: getColorValue(colorId),
    }
  }

  const getColorValue = (colorId) => {
    // Default color mappings for common colors
    const colorMap = {
      red: '#dc2626',
      blue: '#2563eb',
      green: '#16a34a',
      yellow: '#eab308',
      orange: '#ea580c',
      purple: '#9333ea',
      pink: '#ec4899',
      black: '#000000',
      white: '#ffffff',
      gray: '#6b7280',
      gold: '#fbbf24',
      silver: '#9ca3af',
      brown: '#92400e',
      peacock: '#16a34a',
      copper: '#f2760b',
    }

    // Try to find the color or return a default
    const lowerColorId = colorId.toLowerCase()
    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerColorId.includes(key)) {
        return value
      }
    }

    return '#6b7280' // Default gray
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-lg">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[selectedImage]
                    : '/placeholder.jpg'
                }
                alt={product.name || 'Product Image'}
                width={600}
                height={600}
                className="h-full w-full object-cover"
                // onError={(e) => {
                //   e.target.src = '/placeholder.jpg'
                // }}
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? 'border-peacock-500 ring-2 ring-peacock-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder.jpg'}
                      alt={`${product.name || 'Product Image'} ${index + 1}`}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="mb-2 flex items-center space-x-2">
                <span className="text-sm font-medium uppercase tracking-wide text-peacock-600">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="rounded-full bg-peacock-500 px-2 py-1 text-xs font-medium text-white">
                    Featured
                  </span>
                )}
                {getDiscountPercentage() > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                    -{getDiscountPercentage()}%
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating || 4.2} Ratings
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Features
                </h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg
                        className="mr-2 h-4 w-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-peacock-600 underline hover:text-peacock-700"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes &&
                  product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border px-4 py-2 transition-all ${
                        selectedSize === size
                          ? 'border-peacock-500 bg-peacock-50 text-peacock-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors &&
                  product.colors.map((colorId) => {
                    const color = getColorInfo(colorId)
                    return color ? (
                      <button
                        key={colorId}
                        onClick={() => setSelectedColor(colorId)}
                        className={`flex items-center space-x-2 rounded-lg border px-3 py-2 transition-all ${
                          selectedColor === colorId
                            ? 'border-peacock-500 bg-peacock-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div
                          className="h-4 w-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </button>
                    ) : null
                  })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center">
                <div
                  className={`mr-2 h-3 w-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className="text-sm text-gray-600">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || !selectedSize || !selectedColor}
                className="w-full"
                size="lg"
              >
                {!product.inStock
                  ? 'Out of Stock'
                  : isAddingToCart
                    ? 'Product Added, Go To Cart'
                    : 'Add to Cart'}
              </Button>

              <div className="flex space-x-3">
                <Button
                  onClick={handleToggleFavorite}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <svg
                    className={`mr-2 h-5 w-5 ${
                      isFavorited
                        ? 'fill-current text-red-500'
                        : 'text-gray-400'
                    }`}
                    fill={isFavorited ? 'currentColor' : 'none'}
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
                  {isFavorited ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isModalOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />

      {/* Related Products Section */}
      <RelatedProducts product={product} />
    </div>
  )
}
