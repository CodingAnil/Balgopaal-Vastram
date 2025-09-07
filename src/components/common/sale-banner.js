import Link from "next/link";

export default function SaleBanner() {
  return (
    <section className="bg-gradient-to-r from-peacock-500 via-peacock-600 to-copper-600 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Special Offer</h2>
          <p className="mb-8 text-xl opacity-90">
            Get 20% off on your first order + Free Shipping on orders above ₹999
          </p>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Offer 1 */}
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                First Order Discount
              </h3>
              <p className="text-sm opacity-90">
                Get 20% off on your first purchase
              </p>
            </div>

            {/* Offer 2 */}
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Free Shipping</h3>
              <p className="text-sm opacity-90">
                On orders above ₹999 across India
              </p>
            </div>

            {/* Offer 3 */}
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Premium Quality</h3>
              <p className="text-sm opacity-90">
                Handcrafted with love in Haryana
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/products"> 
            <button className="rounded-lg bg-white px-8 py-3 font-medium text-peacock-600 transition-colors duration-200 hover:bg-gray-100">
              Shop Now
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
