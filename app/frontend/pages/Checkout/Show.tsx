import { useForm, Link } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface CheckoutItem {
  productId: number
  name: string
  price: number
  quantity: number
  subtotal: number
}

interface Props {
  items: CheckoutItem[]
  total: number
  buyNow: boolean
  productId?: number
  quantity?: number
  cartCount: number
}

export default function CheckoutShow({ items, total, buyNow, productId, quantity, cartCount }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    billing_address: '',
    product_id: productId,
    quantity: quantity
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/checkout')
  }

  if (items.length === 0) {
    return (
      <Layout cartCount={cartCount}>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No items to checkout</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout cartCount={cartCount}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Information</h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={data.customer_name}
                  onChange={(e) => setData('customer_name', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="customer_email"
                  value={data.customer_email}
                  onChange={(e) => setData('customer_email', e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  value={data.customer_phone}
                  onChange={(e) => setData('customer_phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <textarea
                  id="shipping_address"
                  rows={3}
                  value={data.shipping_address}
                  onChange={(e) => setData('shipping_address', e.target.value)}
                  required
                  placeholder="Street address, city, state, zip code, country"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Billing Address */}
              <div>
                <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address (if different from shipping)
                </label>
                <textarea
                  id="billing_address"
                  rows={3}
                  value={data.billing_address}
                  onChange={(e) => setData('billing_address', e.target.value)}
                  placeholder="Leave blank if same as shipping address"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {buyNow ? (
              <Link
                href={`/products/${productId}`}
                className="block text-center text-indigo-600 hover:text-indigo-800 mt-4 text-sm"
              >
                Back to Product
              </Link>
            ) : (
              <Link
                href="/cart"
                className="block text-center text-indigo-600 hover:text-indigo-800 mt-4 text-sm"
              >
                Edit Cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
