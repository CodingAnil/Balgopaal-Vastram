'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { showToast } from '@/components/ui/toast/notificationToast'

// Admin authentication is handled via API

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'VASTRA',
    originalPrice: '',
    discount: '0',
    colors: [''],
    sizes: [],
    images: [],
    features: [''],
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const categories = ['VASTRA', 'MUKUT', 'BANSURI', 'ACCESSORIES']
  const availableSizes = ['0', '1', '2', '3', '4', '5', '6']

  useEffect(() => {
    // Check if user has admin access in session storage (optional)
    const adminAccess = sessionStorage.getItem('admin-access')
    if (adminAccess === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        sessionStorage.setItem('admin-access', 'true')
        showToast('Welcome to Admin Panel!', 'success')
      } else {
        showToast(data.error || 'Invalid password', 'error')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      showToast('Authentication failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayInputChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    const maxFiles = 5

    if (files.length > maxFiles) {
      showToast(`Maximum ${maxFiles} images allowed`, `error`)
      return
    }

    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        showToast(
          `Invalid file type: ${file.name}. Only JPG, PNG, and WebP allowed.`,
          `error`
        )
        return
      }
      if (file.size > maxSize) {
        showToast(`File too large: ${file.name}. Maximum 5MB allowed.`, `error`)
        return
      }
    }

    setSelectedFiles(files)

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(previewUrls)
  }

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index)

    // Revoke the removed URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index])

    setSelectedFiles(newFiles)
    setImagePreviewUrls(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    if (formData.colors.filter((c) => c.trim()).length === 0) {
      showToast('At least one color is required', 'error')
      return
    }

    if (formData.sizes.length === 0) {
      showToast('At least one size must be selected', 'error')
      return
    }

    if (selectedFiles.length === 0) {
      showToast('At least one image is required', 'error')
      return
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      showToast('Please enter a valid price', 'error')
      return
    }

    setLoading(true)
    setUploading(true)

    try {
      // Step 1: Upload images to Cloudinary
      showToast('Uploading images...', 'info')

      const imageFormData = new FormData()
      selectedFiles.forEach((file) => {
        imageFormData.append('images', file)
      })
      imageFormData.append('adminPassword', password)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload images')
      }

      // Step 2: Save product with Cloudinary URLs
      showToast('Saving product...', 'info')

      const productData = {
        ...formData,
        colors: formData.colors.filter((c) => c.trim()),
        images: uploadData.urls, // Use Cloudinary URLs
        features: formData.features.filter((f) => f.trim()),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        discount: parseFloat(formData.discount),
        adminPassword: password,
      }

      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (response.ok) {
        showToast('Product added successfully!', 'success')

        // Reset form and images
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'VASTRA',
          originalPrice: '',
          discount: '0',
          colors: [''],
          sizes: [],
          images: [],
          features: [''],
        })

        // Clean up image previews
        imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
        setSelectedFiles([])
        setImagePreviewUrls([])
      } else {
        showToast(data.error || 'Failed to add product', 'error')
      }
    } catch (error) {
      console.error('Add product error:', error)
      showToast(
        error.message || 'Failed to add product. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin-access')
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter the admin password to access this panel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-peacock-500 focus:outline-none focus:ring-peacock-500 sm:text-sm"
                placeholder="Admin password"
              />
              <div
                className="cursor-pointer py-2 text-center text-sm text-green-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white hover:bg-peacock-700 focus:outline-none focus:ring-2 focus:ring-peacock-500 focus:ring-offset-2"
              >
                Access Admin Panel
              </button>
            </div>
          </form>
        </div>
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Manage your store</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button
                onClick={() => router.push('/admin/orders')}
                className="rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-peacock-700 focus:outline-none focus:ring-2 focus:ring-peacock-500 focus:ring-offset-2"
              >
                View Orders
              </button> */}
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/orders')}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Manage Orders</div>
                <div className="text-sm text-gray-500">View and update order status</div>
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Add New Product</div>
                <div className="text-sm text-gray-500">Add products with images and details</div>
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Store Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Add Product Form */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Product
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Upload images and add product details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  placeholder="Enter product name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  required
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                placeholder="Enter product description"
                required
                disabled={loading}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="originalPrice"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  placeholder="0"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Colors <span className="text-red-500">*</span>
              </label>
              {formData.colors.map((color, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) =>
                      handleArrayInputChange('colors', index, e.target.value)
                    }
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                    placeholder="Enter color"
                    disabled={loading}
                  />
                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('colors', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('colors')}
                className="text-sm text-peacock-600 hover:text-peacock-800"
                disabled={loading}
              >
                + Add Color
              </button>
            </div>

            {/* Sizes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sizes <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-7 gap-2">
                {availableSizes.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="rounded border-gray-300 text-peacock-600 focus:ring-peacock-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm">Size {size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Images <span className="text-red-500">*</span>
              </label>
              <p className="mb-4 text-sm text-gray-600">
                Select up to 5 images (JPG, PNG, WebP). Maximum 5MB per image.
              </p>

              {/* File Input */}
              <div className="mb-4">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                  disabled={loading || uploading}
                />
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg border border-gray-300">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white transition-colors hover:bg-red-600"
                        disabled={loading || uploading}
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black bg-opacity-50 p-1 text-center text-xs text-white">
                        {(selectedFiles[index].size / 1024 / 1024).toFixed(1)}MB
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Status */}
              {uploading && (
                <div className="mb-4 flex items-center space-x-2 text-peacock-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-peacock-600"></div>
                  <span className="text-sm">Uploading images...</span>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Features
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      handleArrayInputChange('features', index, e.target.value)
                    }
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                    placeholder="Enter product feature"
                    disabled={loading}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('features', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('features')}
                className="text-sm text-peacock-600 hover:text-peacock-800"
                disabled={loading}
              >
                + Add Feature
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="rounded-md border border-transparent bg-peacock-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-peacock-700 focus:outline-none focus:ring-2 focus:ring-peacock-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || uploading}
              >
                {uploading
                  ? 'Uploading Images...'
                  : loading
                    ? 'Adding Product...'
                    : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
