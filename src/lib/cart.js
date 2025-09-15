// Cart management utilities
export const CART_STORAGE_KEY = 'balgopaal-vastram-cart'

export const getCart = () => {
  if (typeof window === 'undefined') return []

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    return cartData ? JSON.parse(cartData) : []
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    return []
  }
}

export const saveCart = (cart) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export const addToCart = (
  product,
  selectedSize,
  selectedColor,
  quantity = 1
) => {
  const cart = getCart()
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.id === product.id &&
      item.size === selectedSize &&
      item.color === selectedColor
  )

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : '/hero/peckok.jpeg',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      inStock: product.inStock,
      colors: product.colors || [],
      sizes: product.sizes || [],
      rating: product.rating,
      reviews: product.reviews,
      featured: product.featured || false,
      description: product.description || '',
    })
  }

  saveCart(cart)
  return cart
}

export const removeFromCart = (itemId, size, color) => {
  const cart = getCart()
  const updatedCart = cart.filter(
    (item) =>
      !(item.id === itemId && item.size === size && item.color === color)
  )
  saveCart(updatedCart)
  return updatedCart
}

export const updateCartItemQuantity = (itemId, size, color, quantity) => {
  const cart = getCart()
  const itemIndex = cart.findIndex(
    (item) => item.id === itemId && item.size === size && item.color === color
  )

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    saveCart(cart)
  }

  return cart
}

export const clearCart = () => {
  saveCart([])
  return []
}

export const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0)
}

export const getCartSubtotal = (cart) => {
  return getCartTotal(cart)
}

export const getShippingCost = (cart, siteConfig) => {
  const subtotal = getCartSubtotal(cart)
  return subtotal >= siteConfig.shipping.freeShippingThreshold
    ? 0
    : siteConfig.shipping.standardShipping
}

export const getCartTotalWithShipping = (cart, siteConfig) => {
  const subtotal = getCartSubtotal(cart)
  const shipping = getShippingCost(cart, siteConfig)
  return subtotal + shipping
}
