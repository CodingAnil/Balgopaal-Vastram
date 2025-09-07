# MongoDB Integration for Balgopaal Vastram E-commerce

This document outlines the complete MongoDB integration implemented for the Balgopaal Vastram Next.js e-commerce application.

## 🎯 Overview

The application has been extended with full MongoDB integration using Mongoose, providing:
- Product management with admin interface
- Order processing and tracking
- User management
- Complete API ecosystem with filtering, pagination, and search

## 🔧 Technical Stack

- **Database**: MongoDB with Mongoose ODM
- **Backend**: Next.js API Routes
- **Frontend**: React with Tailwind CSS
- **Payment**: Razorpay integration
- **Authentication**: Admin password protection

## 📁 File Structure

```
src/
├── lib/
│   ├── db.js                     # MongoDB connection
│   └── models/
│       ├── Product.js             # Product schema
│       ├── User.js                # User schema
│       └── Order.js               # Order schema
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.js           # GET products with filters
│   │   │   └── add/route.js       # POST new product (admin)
│   │   └── orders/
│   │       ├── create/route.js    # POST create order
│   │       ├── user/[email]/route.js  # GET user orders
│   │       └── [id]/route.js      # GET/PATCH single order
│   ├── about/page.js              # Updated with admin access
│   ├── checkout/page.js           # Updated with order saving
│   ├── products/page.js           # Updated to use API
│   └── orders/
│       ├── page.js                # Orders listing page
│       └── [id]/page.js           # Single order view
└── components/
    └── admin/
        └── AddProductForm.js      # Admin product form
```

## 🗄️ Database Schema

### Product Model
```javascript
{
  name: String (required, max 100 chars)
  description: String (required, max 1000 chars)
  price: Number (required, min 0)
  category: Enum ['VASTRA', 'MUKUT', 'BANSURI', 'ACCESSORIES']
  color: String (required)
  size: Enum ['0', '1', '2', '3', '4', '5', '6']
  image: String (required, URL)
  isFavorite: Boolean (default false)
  slug: String (auto-generated, unique)
  inStock: Boolean (default true)
  originalPrice: Number (optional)
  discount: Number (0-100, default 0)
  createdAt: Date
  updatedAt: Date
}
```

### User Model
```javascript
{
  name: String (required, max 50 chars)
  email: String (required, unique, validated)
  phone: String (required, 10 digits)
  address: String (required, max 200 chars)
  city: String (required, max 50 chars)
  state: String (required, max 50 chars)
  pincode: String (required, 6 digits)
  isActive: Boolean (default true)
  createdAt: Date
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderId: String (auto-generated, unique)
  user: ObjectId (ref to User)
  items: [{
    productId: ObjectId (ref to Product)
    name: String
    size: String
    color: String
    quantity: Number (min 1)
    price: Number (min 0)
  }]
  subtotal: Number (required, min 0)
  shipping: Number (min 0, default 0)
  tax: Number (min 0, default 0)
  total: Number (required, min 0)
  status: Enum ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  paymentMethod: Enum ['RAZORPAY', 'COD']
  paymentStatus: Enum ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
  razorpayOrderId: String
  razorpayPaymentId: String
  razorpaySignature: String
  shippingAddress: {
    name, phone, address, city, state, pincode
  }
  estimatedDelivery: Date
  trackingNumber: String
  notes: String (max 500 chars)
  createdAt: Date
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Products API

#### GET `/api/products`
Retrieve products with filtering, pagination, and search.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `color` - Filter by color
- `size` - Filter by size
- `search` - Text search in name, description, color
- `sort` - Sort options: name-asc, name-desc, price-low, price-high, newest, oldest
- `inStock` - Filter by stock status (true/false)

**Response:**
```javascript
{
  success: true,
  products: [...],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalProducts: 50,
    hasNext: true,
    hasPrev: false,
    limit: 10
  },
  filters: {
    categories: [...],
    colors: [...],
    sizes: [...]
  }
}
```

#### POST `/api/products/add`
Add new product (Admin only).

**Required Headers:**
- `Content-Type: application/json`

**Request Body:**
```javascript
{
  name: "Product Name",
  description: "Product description",
  price: 1000,
  category: "VASTRA",
  color: "Blue",
  size: "2",
  image: "https://example.com/image.jpg",
  originalPrice: 1200, // optional
  discount: 10 // optional
}
```

### Orders API

#### POST `/api/orders/create`
Create new order.

**Request Body:**
```javascript
{
  userInfo: {
    name: "Customer Name",
    email: "customer@example.com",
    phone: "1234567890",
    address: "Full Address",
    city: "City",
    state: "State",
    pincode: "123456"
  },
  items: [{
    productId: "product_id",
    name: "Product Name",
    size: "2",
    color: "Blue",
    quantity: 1,
    price: 1000
  }],
  subtotal: 1000,
  shipping: 0,
  tax: 0,
  total: 1000,
  paymentMethod: "RAZORPAY", // or "COD"
  razorpayOrderId: "order_id", // if Razorpay
  razorpayPaymentId: "payment_id", // if paid
  razorpaySignature: "signature" // if paid
}
```

#### GET `/api/orders/user/[email]`
Get all orders for a user by email.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by order status

#### GET `/api/orders/[id]`
Get single order details by order ID or MongoDB _id.

#### PATCH `/api/orders/[id]`
Update order status (for admin).

**Request Body:**
```javascript
{
  status: "SHIPPED",
  paymentStatus: "PAID",
  trackingNumber: "TRACK123",
  notes: "Order notes",
  estimatedDelivery: "2024-01-15"
}
```

## 🔐 Admin Features

### Admin Access
- Access via About Us page → "Go to Admin" button
- Protected API endpoints validate admin password

### Add Product Form
- Comprehensive validation
- Real-time feedback
- Success/error notifications
- Form reset after successful submission

## 🛒 Frontend Integration

### Product Listing (`/products`)
- Real-time API integration
- Dynamic filtering from database
- Search functionality
- Pagination with page numbers
- Loading states and error handling
- Responsive design

### Checkout Process (`/checkout`)
- Automatic order creation after payment
- User creation if email doesn't exist
- Both Razorpay and COD support
- Order saved to database with all details

### Order Management (`/orders`)
- Email-based order lookup
- Order history with pagination
- Detailed order view with tracking
- Order status visualization
- Responsive order cards

## 🚀 Setup Instructions

### 1. Environment Variables
Create `.env.local` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/balgopaal-vastram
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/balgopaal-vastram

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install mongoose
```

### 3. Database Setup
- MongoDB will automatically create collections on first use
- Indexes are created automatically via Mongoose schema
- No manual database setup required

### 4. Admin Access
- Access via: About Us page → "Go to Admin" button
- Can be changed in `/api/products/add/route.js`

## 📊 Features Implemented

### ✅ Database Integration
- [x] MongoDB connection with connection pooling
- [x] Mongoose schemas with validation
- [x] Automatic indexing for performance
- [x] Error handling and connection management

### ✅ Product Management
- [x] Admin-protected product addition
- [x] Product listing with filters and search
- [x] Category, color, size filtering
- [x] Price-based sorting
- [x] Pagination support
- [x] Stock management

### ✅ Order Processing
- [x] Complete order creation workflow
- [x] User auto-creation and management
- [x] Payment integration (Razorpay + COD)
- [x] Order status tracking
- [x] Email-based order lookup
- [x] Order history with pagination

### ✅ User Experience
- [x] Responsive design across all pages
- [x] Loading states and error handling
- [x] Toast notifications for feedback
- [x] Form validation and user guidance
- [x] Navigation integration

### ✅ API Security
- [x] Input validation and sanitization
- [x] Error handling without data leakage
- [x] Admin authentication for protected routes
- [x] CORS and security headers

## 🧪 Testing Recommendations

### API Testing
```bash
# Test product creation
curl -X POST http://localhost:3000/api/products/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 500,
    "category": "VASTRA",
    "color": "Red",
    "size": "2",
    "image": "https://example.com/image.jpg",
  }'

# Test product listing
curl "http://localhost:3000/api/products?page=1&limit=5&category=VASTRA"

# Test order creation
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{...order_data...}'
```

### Manual Testing Checklist
- [ ] Admin can add products via About Us page
- [ ] Product listing loads with filters
- [ ] Search functionality works
- [ ] Pagination works correctly
- [ ] Checkout saves orders to database
- [ ] Order lookup by email works
- [ ] Single order view displays correctly
- [ ] Error states display properly

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI in .env.local
   - Ensure MongoDB server is running
   - Verify network connectivity

2. **Admin Access Denied**
   - Clear browser cache/localStorage
   - Check console for errors

3. **Products Not Loading**
   - Check API endpoint response
   - Verify database has products
   - Check network tab for errors

4. **Orders Not Saving**
   - Verify all required fields in checkout
   - Check API response for validation errors
   - Ensure user info is complete

### Development Tips
- Use MongoDB Compass for database visualization
- Check browser network tab for API calls
- Monitor console for errors and warnings
- Use React DevTools for component debugging

## 🚀 Deployment Considerations

### Production Setup
1. Use MongoDB Atlas for cloud database
2. Set proper environment variables
3. Enable database indexing for performance
4. Implement proper error logging
5. Add rate limiting for API endpoints
6. Set up backup and monitoring

### Performance Optimization
- Implement Redis caching for frequent queries
- Add database connection pooling
- Optimize images with Next.js Image component
- Enable gzip compression
- Implement lazy loading for large product lists

---

**Implementation completed successfully!** 🎉

All requested features have been implemented with proper error handling, validation, and user experience considerations. The application now has a complete e-commerce backend with MongoDB integration.
