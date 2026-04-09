import { Link, router } from '@inertiajs/react'
import { ReactNode } from 'react'

interface Admin {
  email: string
}

interface AdminLayoutProps {
  children: ReactNode
  admin: Admin
}

export default function AdminLayout({ children, admin }: AdminLayoutProps) {
  const handleLogout = () => {
    router.delete('/admin/logout')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold">
                Admin Panel
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin/products"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Orders
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{admin.email}</span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-800 px-4 py-2">
        <nav className="flex gap-4">
          <Link
            href="/admin/products"
            className="text-gray-300 hover:text-white font-medium text-sm"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="text-gray-300 hover:text-white font-medium text-sm"
          >
            Orders
          </Link>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
