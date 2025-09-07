'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ui/product-card'
import Button from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function RelatedProducts({ product }) {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRelatedProducts()
  }, [product])

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true)
      
      // First try to get products from the same category
      const categoryResponse = await fetch(`/api/products?category=${product.category}&limit=8`)
      const categoryData = await categoryResponse.json()
      
      if (categoryData.success && categoryData.products.length > 0) {
        // Filter out the current product and limit to 4
        const filtered = categoryData.products
          .filter(p => p._id !== product._id && p._id !== product.id)
          .slice(0, 4)
          .map(p => ({ ...p, id: p._id }))
        
        setRelatedProducts(filtered)
      } else {
        // If no products in same category, get random products
        const response = await fetch('/api/products?limit=4')
        const data = await response.json()
        
        if (data.success) {
          const filtered = data.products
            .filter(p => p._id !== product._id && p._id !== product.id)
            .slice(0, 4)
            .map(p => ({ ...p, id: p._id }))
          
          setRelatedProducts(filtered)
        }
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
      setRelatedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleShowMoreProducts = () => {
    router.push('/products')
  }

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Related Products</h2>
            <p className="mt-2 text-lg text-gray-600">Loading related products...</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse rounded-lg bg-gray-200 h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Related Products
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            You might also like these products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id || relatedProduct._id}
              product={relatedProduct}
            />
          ))}
        </div>

        {/* Show More Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleShowMoreProducts}
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
            Show More Products
          </Button>
        </div>
      </div>
    </div>
  )
}
