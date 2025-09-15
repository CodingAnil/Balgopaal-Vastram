'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AddProductForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'VASTRA',
    color: '',
    size: '0',
    image: '',
    originalPrice: '',
    discount: '0',
  })
  const [loading, setLoading] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  const categories = ['VASTRA', 'MUKUT', 'BANSURI', 'ACCESSORIES']
  const sizes = ['0', '1', '2', '3', '4', '5', '6']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!adminPassword) {
      toast.error('Please enter admin password')
      return
    }

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.color ||
      !formData.image
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    if (
      formData.originalPrice &&
      (isNaN(formData.originalPrice) || parseFloat(formData.originalPrice) <= 0)
    ) {
      toast.error('Please enter a valid original price')
      return
    }

    if (
      isNaN(formData.discount) ||
      parseFloat(formData.discount) < 0 ||
      parseFloat(formData.discount) > 100
    ) {
      toast.error('Discount must be between 0 and 100')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          adminPassword,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice
            ? parseFloat(formData.originalPrice)
            : undefined,
          discount: parseFloat(formData.discount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Product added successfully!')
        if (onSuccess) onSuccess(data.product)
        if (onClose) onClose()
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'VASTRA',
          color: '',
          size: '0',
          image: '',
          originalPrice: '',
          discount: '0',
        })
        setAdminPassword('')
      } else {
        toast.error(data.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Add product error:', error)
      toast.error('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            disabled={loading}
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

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Admin Password */}
          <div>
            <label
              htmlFor="adminPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Admin Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
              placeholder="Enter admin password"
              required
              disabled={loading}
            />
          </div>

          {/* Product Name */}
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
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
              placeholder="Enter product description"
              required
              disabled={loading}
            />
          </div>

          {/* Price and Original Price */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

          {/* Category and Size */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <div>
              <label
                htmlFor="size"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Size <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
                required
                disabled={loading}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    Size {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label
              htmlFor="color"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
              placeholder="Enter product color"
              required
              disabled={loading}
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-peacock-500"
              placeholder="https://example.com/image.jpg"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-peacock-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-peacock-700 focus:outline-none focus:ring-2 focus:ring-peacock-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
