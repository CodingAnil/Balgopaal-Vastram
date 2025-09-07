
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'
import ProductDetailsClient from './product-details-client'

async function getProduct(slug) {
  try {
    await connectDB()
    
    // Get product from database only
    const dbProduct = await Product.findOne({ slug }).lean()
    if (dbProduct) {
      return {
        ...dbProduct,
        _id: dbProduct._id.toString(),
        id: dbProduct._id.toString() // Add id for compatibility
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateStaticParams() {
  try {
    await connectDB()
    const products = await Product.find({}, 'slug').lean()
    
    return products.map((product) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you\'re looking for doesn\'t exist.',
      openGraph: {
        title: 'Product Not Found',
        description: 'The product you\'re looking for doesn\'t exist.',
        images: ['/placeholder.jpg'],
      },
    }
  }

  return {
    title: `${product.name} - Balgopaal Vastram`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Balgopaal Vastram`,
      description: product.description,
      images: [product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'],
    },
  }
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = params
  const product = await getProduct(slug)

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return <ProductDetailsClient product={product} />
}
