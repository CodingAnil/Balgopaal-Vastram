import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/lib/models/Product'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const sampleProducts = [
  {
    name: 'Golden Peacock Feather Mukut',
    description:
      'Beautiful golden mukut adorned with real peacock feathers, perfect for divine occasions. Handcrafted with traditional techniques.',
    price: 1200,
    originalPrice: 1500,
    category: 'MUKUT',
    colors: ['gold', 'peacock'],
    sizes: ['2', '3', '4', '5'],
    images: ['/hero/peckok.jpeg', '/hero/matki.jpg'],
    features: [
      'Real peacock feathers',
      'Golden finish coating',
      'Traditional craftsmanship',
      'Lightweight design',
      'Perfect for festivals',
    ],
    isFavorite: true,
    inStock: true,
    discount: 20,
  },
  {
    name: 'Red Silk Divine Vastra',
    description:
      'Premium red silk vastra with intricate golden embroidery work. Made from finest silk threads for ultimate comfort.',
    price: 980,
    originalPrice: 1200,
    category: 'VASTRA',
    colors: ['red', 'gold'],
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    images: ['/hero/krishnareddress.jpg', '/hero/krishnabluedress.jpg'],
    features: [
      'Pure silk fabric',
      'Hand-embroidered gold work',
      'Traditional motifs',
      'Soft and comfortable',
      'Easy to maintain',
    ],
    isFavorite: true,
    inStock: true,
    discount: 18,
  },
  {
    name: 'Copper Traditional Bansuri',
    description:
      'Handcrafted copper bansuri flute with excellent sound quality. Perfect for devotional music and meditation.',
    price: 650,
    originalPrice: 750,
    category: 'BANSURI',
    colors: ['copper', 'brown'],
    sizes: ['3', '4', '5', '6'],
    images: ['/hero/matki2.jpg', '/hero/standkrishna.jpg'],
    features: [
      'Copper finish coating',
      'Traditional bamboo base',
      'Excellent sound quality',
      'Durable construction',
      'Perfect tuning',
    ],
    isFavorite: true,
    inStock: true,
    discount: 13,
  },
  {
    name: 'Blue Royal Silk Vastra',
    description:
      'Elegant blue silk vastra representing the divine color of Krishna. Features silver thread embroidery.',
    price: 1100,
    originalPrice: 1300,
    category: 'VASTRA',
    colors: ['blue', 'silver'],
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    images: ['/hero/krishnabluedress.jpg', '/hero/gopalSizeDress.jpeg'],
    features: [
      'Royal blue silk',
      'Silver thread work',
      'Krishna inspired design',
      'Premium quality',
      'Comfortable fit',
    ],
    isFavorite: false,
    inStock: true,
    discount: 15,
  },
  {
    name: 'Sacred Crown Mukut Gold',
    description:
      'Luxurious golden crown mukut with intricate patterns and decorative gems. Perfect for special occasions.',
    price: 1800,
    originalPrice: 2200,
    category: 'MUKUT',
    colors: ['gold'],
    sizes: ['1', '2', '3', '4', '5', '6'],
    images: ['/hero/peckok.jpeg', '/hero/balkrishna.jpg'],
    features: [
      'Premium golden finish',
      'Decorative gem work',
      'Intricate patterns',
      'Perfect fit',
      'Festival ready',
    ],
    isFavorite: true,
    inStock: true,
    discount: 18,
  },
  {
    name: 'Yellow Festive Vastra',
    description:
      'Bright yellow silk vastra perfect for festivals and celebrations. Features golden thread embroidery.',
    price: 850,
    originalPrice: 1000,
    category: 'VASTRA',
    colors: ['yellow', 'gold'],
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    images: ['/hero/krishnamtki.jpg', '/hero/gopalSize.png'],
    features: [
      'Bright yellow silk',
      'Golden embroidery',
      'Festive design',
      'Soft texture',
      'Easy care',
    ],
    isFavorite: false,
    inStock: true,
    discount: 15,
  },
]

export async function POST(request) {
  try {
    const { adminPassword } = await request.json()

    // Admin authentication
    if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid admin password.' },
        { status: 401 }
      )
    }

    await connectDB()

    // Clear existing products (optional)
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts)

    console.log(`Inserted ${insertedProducts.length} sample products`)

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      products: insertedProducts.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        isFavorite: p.isFavorite,
      })),
    })
  } catch (error) {
    console.error('Seed products error:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed products',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
