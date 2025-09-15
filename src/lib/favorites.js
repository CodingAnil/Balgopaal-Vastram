// Favorites/Wishlist management utilities
export const FAVORITES_STORAGE_KEY = 'balgopaal-vastram-favorites'

export const getFavorites = () => {
  if (typeof window === 'undefined') return []

  try {
    const favoritesData = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return favoritesData ? JSON.parse(favoritesData) : []
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
    return []
  }
}

export const saveFavorites = (favorites) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

export const addToFavorites = (product) => {
  const favorites = getFavorites()
  const productId = product.id || product._id

  if (!favorites.find((item) => item.id === productId)) {
    favorites.push({
      id: productId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : '/placeholder.jpg',
      category: product.category,
      colors: product.colors || [],
      sizes: product.sizes || [],
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      featured: product.featured || false,
      description: product.description || '',
    })
    saveFavorites(favorites)
  }

  return favorites
}

export const removeFromFavorites = (productId) => {
  const favorites = getFavorites()
  const updatedFavorites = favorites.filter((item) => item.id !== productId)
  saveFavorites(updatedFavorites)
  return updatedFavorites
}

export const isFavorite = (productId) => {
  const favorites = getFavorites()
  return favorites.some((item) => item.id === productId)
}

export const toggleFavorite = (product) => {
  const productId = product.id || product._id
  if (isFavorite(productId)) {
    return removeFromFavorites(productId)
  } else {
    return addToFavorites(product)
  }
}

export const clearFavorites = () => {
  saveFavorites([])
  return []
}

export const searchFavorites = (query) => {
  const favorites = getFavorites()
  if (!query || !query.trim()) {
    return favorites
  }

  const searchTerm = query.toLowerCase().trim()
  return favorites.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.colors &&
        product.colors.some((color) =>
          color.toLowerCase().includes(searchTerm)
        ))
  )
}

export const getFavoritesCount = () => {
  return getFavorites().length
}
