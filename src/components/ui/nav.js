import Link from 'next/link'
import { navigation } from '@/lib/config'

export default function Nav({ className = '' }) {
  return (
    <nav className={`${className}`}>
      <ul className="flex space-x-8">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-primary-600"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
