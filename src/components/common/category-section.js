import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function CategorySection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Our Categories
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover our beautiful collection of devotional wear for Laddu
            Gopal, carefully crafted with love and tradition.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {siteConfig.categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative transform overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Background Image */}
              <div className="relative aspect-square">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    category.id === 'vastra'
                      ? 'from-peacock-400 to-peacock-600'
                      : category.id === 'mukut'
                        ? 'from-copper-400 to-copper-600'
                        : 'from-yellow-400 to-yellow-600'
                  }`}
                >
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                  {/* Icon */}
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    {category.id === 'vastra' && (
                      <svg
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                    {category.id === 'mukut' && (
                      <svg
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                    {category.id === 'bansuri' && (
                      <svg
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-center text-2xl font-bold">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-sm leading-relaxed text-white/90">
                    {category.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full transform bg-white/95 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    Explore Collection
                  </span>
                  <svg
                    className="h-5 w-5 text-peacock-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
