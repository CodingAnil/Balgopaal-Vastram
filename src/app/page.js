import HeroSlider from '@/components/common/hero-slider'
import CategorySection from '@/components/common/category-section'
import FeaturedProducts from '@/components/common/featured-products'
import SaleBanner from '@/components/common/sale-banner'
import Testimonials from '@/components/common/testimonials'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

async function getFeaturedProductsFromDB() {
  try {
    await connectDB()
    
    const featuredProducts = await Product.find({ 
      inStock: true 
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()

    // Convert MongoDB _id to string for serialization
    return featuredProducts.map(product => ({
      ...product,
      _id: product._id.toString(),
      id: product._id.toString() // Add id for compatibility
    }))

  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProductsFromDB()

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Sale Banner */}
      <SaleBanner />

      {/* Testimonials */}
      <Testimonials />
    </div>
  )
}
