export const siteConfig = {
  name: 'Balgopaal Vastram',
  description:
    'Devotional wear for Laddu Gopal - Handcrafted Vastra, Mukut, and Bansuri from Haryana',
  url: 'https://balgopaal-vastram.com',
  ogImage: '/hero/peckok.jpeg',
  links: {
    twitter: 'https://twitter.com/balgopaalvastram',
    facebook: 'https://facebook.com/balgopaalvastram',
    instagram: 'https://instagram.com/balgopaalvastram',
    whatsapp: 'https://wa.me/918295273371',
  },
  contact: {
    email: 'info@balgopaal-vastram.com',
    phone: '+91 82952 73371',
    address: 'Fatehabad, Haryana, India',
  },
  categories: [
    {
      id: 'vastra',
      name: 'Vastra',
      description: 'Beautiful dresses for Laddu Gopal',
    },
    { id: 'mukut', name: 'Mukut', description: 'Crowns and headwear' },
    {
      id: 'bansuri',
      name: 'Bansuri',
      description: 'Flutes and musical instruments',
    },
  ],
  sizes: [
    { id: '0', name: 'Size 0', height: '1.75 inch', diameter: '4.0 inch' },
    { id: '1', name: 'Size 1', height: '2.20 inch', diameter: '5.0 inch' },
    { id: '2', name: 'Size 2', height: '2.75 inch', diameter: '6.0 inch' },
    { id: '3', name: 'Size 3', height: '3.15 inch', diameter: '7.0 inch' },
    { id: '4', name: 'Size 4', height: '3.40 inch', diameter: '8.0 inch' },
    { id: '5', name: 'Size 5', height: '3.80 inch', diameter: '10.0 inch' },
    { id: '6', name: 'Size 6', height: '4.40 inch', diameter: '12.0 inch' },
  ],
  colors: [
    { id: 'peacock-green', name: 'Peacock Green', value: '#16a34a' },
    { id: 'copper', name: 'Copper', value: '#f2760b' },
    { id: 'gold', name: 'Gold', value: '#fbbf24' },
    { id: 'red', name: 'Red', value: '#dc2626' },
    { id: 'blue', name: 'Blue', value: '#2563eb' },
    { id: 'yellow', name: 'Yellow', value: '#eab308' },
  ],
  shipping: {
    freeShippingThreshold: 999,
    standardShipping: 50,
    expressShipping: 100,
  },
  payment: {
    upi: 'balgopaal-vastram@paytm',
    whatsapp: '+91 82952 73371',
  },
}
