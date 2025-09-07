'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { siteConfig } from '@/lib/config'
import ProductCard from '@/components/ui/product-card'
import Button from '@/components/ui/button'
import toast from 'react-hot-toast'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    size: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    colors: [],
    sizes: []
  })

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || ''
    setFilters((prev) => ({ ...prev, category }))
  }, [searchParams])

  // Fetch products when filters, search, or sort changes
  useEffect(() => {
    fetchProducts()
  }, [filters, searchQuery, sortBy, currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: sortBy
      })

      // Add filters
      if (filters.category) params.append('category', filters.category)
      if (filters.color) params.append('color', filters.color)
      if (filters.size) params.append('size', filters.size)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setProducts(data.products)
        setPagination(data.pagination)
        setAvailableFilters(data.filters)
      } else {
        setError(data.error || 'Failed to fetch products')
        toast.error(data.error || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products')
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page when sorting
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      color: '',
      size: '',
    })
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ''
  ).length + (searchQuery ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our beautiful collection of devotional wear for Laddu Gopal
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-peacock-600 hover:text-peacock-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              {/* <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search Products
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name, description, color..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  disabled={loading}
                />
              </div> */}

              {/* Category Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  disabled={loading}
                >
                  <option value="">All Categories</option>
                  {availableFilters.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Color
                </label>
                <select
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  disabled={loading}
                >
                  <option value="">All Colors</option>
                  {availableFilters.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Size
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  disabled={loading}
                >
                  <option value="">All Sizes</option>
                  {availableFilters.sizes.map((size) => (
                    <option key={size} value={size}>
                      Size {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              {/* <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange('minPrice', e.target.value)
                    }
                    placeholder="Min Price"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', e.target.value)
                    }
                    placeholder="Max Price"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  />
                </div>
              </div> */}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Results Count */}
                <div className="flex items-center space-x-4">
                  {loading ? (
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        {pagination ? 
                          `Showing ${products.length} of ${pagination.totalProducts} products` :
                          `${products.length} products`
                        }
                      </p>
                      {pagination && pagination.totalPages > 1 && (
                        <span className="text-sm text-gray-500">
                          Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                      )}
                    </>
                  )}
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-peacock-100 px-2 py-1 text-xs text-peacock-800">
                      {activeFiltersCount} filter
                      {activeFiltersCount > 1 ? 's' : ''} applied
                    </span>
                  )}
                </div>

                {/* Sort and Filter Toggle */}
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                    disabled={loading}
                  >
                    <option value="name-asc">Sort by Name (A-Z)</option>
                    <option value="name-desc">Sort by Name (Z-A)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    {/* <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option> */}
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-lg border border-gray-300 px-4 py-2 transition-colors duration-200 hover:bg-gray-50 lg:hidden"
                    disabled={loading}
                  >
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-12 w-12 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Error Loading Products
                </h3>
                <p className="mb-4 text-gray-600">{error}</p>
                <Button onClick={fetchProducts} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-md">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page <span className="font-medium">{currentPage}</span> of{' '}
                          <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalProducts} total products)
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrev}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {/* Page Numbers */}
                          {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                            const pageNumber = Math.max(1, currentPage - 2) + index
                            if (pageNumber <= pagination.totalPages) {
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    pageNumber === currentPage
                                      ? 'z-10 bg-peacock-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peacock-600'
                                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              )
                            }
                            return null
                          })}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNext}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No Products Found */}
            {!loading && !error && products.length === 0 && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mb-4 text-gray-600">
                  {activeFiltersCount > 0 
                    ? "Try adjusting your search or filter criteria"
                    : "No products are available at the moment"
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-peacock-500"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}
