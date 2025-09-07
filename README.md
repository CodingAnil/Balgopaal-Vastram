# Balgopaal Vastram - Ecommerce Website

A beautiful, responsive ecommerce website for devotional wear for Laddu Gopal, built with Next.js 15, Tailwind CSS, and featuring a peacock green & copper color theme.

## Features

- **Static Export (SSG)** - Fully static website for fast loading
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **SEO Optimized** - Complete SEO setup with metadata, sitemap, robots.txt
- **Product Management** - Full product catalog with search, filter, and sort
- **Shopping Cart** - Client-side cart with localStorage persistence
- **Favorites System** - Wishlist functionality
- **Size Guide** - Interactive Laddu Gopal size chart popup
- **Payment Integration** - WhatsApp-based order processing
- **Modern UI/UX** - Beautiful design with peacock green & copper theme

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Font**: Inter (Google Fonts)
- **Testing**: Vitest + React Testing Library + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd balgopaal-vastram
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

1. Build the static export:

```bash
npm run export
```

2. The static files will be generated in the `out/` directory.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── products/          # Products pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   ├── favorites/         # Favorites page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── sitemap.js         # Sitemap generation
│   └── robots.js          # Robots.txt
├── components/            # React components
│   ├── ui/               # UI components
│   └── common/           # Common components
├── lib/                  # Utility functions
│   ├── config.js         # Site configuration
│   ├── products.js       # Product data
│   ├── cart.js           # Cart management
│   ├── favorites.js      # Favorites management
│   └── seo.js            # SEO utilities
└── styles/               # Global styles
    └── globals.css       # Tailwind CSS
```

## Key Features

### Home Page

- Hero slider with 5 slides
- Product categories (Vastra, Mukut, Bansuri)
- Featured products grid
- Sale banner
- Customer testimonials

### Products

- Product listing with search, sort, and filter
- Product detail pages with image gallery
- Size and color selection
- Add to cart and favorites functionality

### Cart & Checkout

- Shopping cart with quantity management
- Checkout form with customer information
- WhatsApp-based order processing
- Order confirmation page

### Size Guide

- Global floating button
- Interactive popup with Laddu Gopal size chart
- Idol height to dress size mapping

## Configuration

Edit `src/lib/config.js` to customize:

- Site information
- Contact details
- Product categories
- Size guide data
- Color palette
- Shipping settings

## SEO Features

- Dynamic metadata generation
- Open Graph tags
- Twitter Card support
- JSON-LD structured data
- XML sitemap
- Robots.txt
- Canonical URLs

## Deployment

The website is configured for static export and can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your repository
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload the `out/` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@balgopaal-vastram.com or call +91 82952 73371.
