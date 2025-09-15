'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { addToCart } from '@/lib/cart'
import { toggleFavorite, isFavorite } from '@/lib/favorites'
import { siteConfig } from '@/lib/config'
import Button from './button'
import { showToast } from '@/components/ui/toast/notificationToast'
import { useRouter } from 'next/navigation'

export default function ProductCard({ product, setFavorites }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const router = useRouter()
  // Check if product is favorited on mount and listen for changes
  useEffect(() => {
    console.log(product, 'product id')
    const checkFavoriteStatus = () => {
      setIsFavorited(isFavorite(product.id || product._id))
    }

    checkFavoriteStatus()

    // Listen for favorite changes across the app
    const handleFavoriteChange = (e) => {
      if (
        e.detail &&
        (e.detail.productId === product.id ||
          e.detail.productId === product._id)
      ) {
        checkFavoriteStatus()
      }
    }

    window.addEventListener('favoriteChanged', handleFavoriteChange)

    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange)
    }
  }, [product.id, product._id])

  const handleAddToCart = async () => {
    if (isAddingToCart) {
      router.push('/cart')
      return
    }
    setIsAddingToCart(true)
    try {
      const selectedSize =
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
      const selectedColor =
        product.colors && product.colors.length > 0 ? product.colors[0] : null

      addToCart(product, selectedSize, selectedColor, 1)
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

    if (setFavorites) {
      setFavorites(newFavorites)
    }
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
    <div className="group overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <img
            src={
              product?.image ||
              (product?.images && product.images.length > 0
                ? product.images[0]
                : '/placeholder.jpg')
            }
            alt={product.name || 'Product Image'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/placeholder.jpg'
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col space-y-2">
          {product.isFavorite && (
            <span className="rounded-full bg-peacock-500 px-2 py-1 text-xs font-medium text-white">
              Featured
            </span>
          )}
          {getDiscountPercentage() > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
              -{getDiscountPercentage()}%
            </span>
          )}
          {product.inStock === false && (
            <span className="rounded-full bg-gray-500 px-2 py-1 text-xs font-medium text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 shadow-md transition-all duration-200 hover:bg-white"
        >
          <svg
            className={`h-5 w-5 transition-colors duration-200 ${
              isFavorited ? 'fill-current text-red-500' : 'text-gray-400'
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
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-peacock-600">
            {product.category || 'Uncategorized'}
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-peacock-600">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {/* <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {product.description || 'No description available'}
        </p> */}

        {/* Rating */}
        <div className="mb-3 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
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
            {product.rating || 4.2}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price || 0)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">Colors:</span>
          <div className="flex space-x-1">
            {product.colors &&
              product.colors.slice(0, 3).map((colorId) => {
                const color = siteConfig.colors.find((c) => c.id === colorId)
                const colorValue = color ? color.value : getColorValue(colorId)
                const colorName = color
                  ? color.name
                  : colorId.charAt(0).toUpperCase() +
                    colorId.slice(1).replace('-', ' ')

                return (
                  <div
                    key={colorId}
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorValue }}
                    title={colorName}
                  />
                )
              })}
            {product.colors && product.colors.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className="w-full"
          size="sm"
        >
          {product.inStock === false
            ? 'Out of Stock'
            : isAddingToCart
              ? 'Go To Cart'
              : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
