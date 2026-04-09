import { Link, useForm, router } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
  stock: number
  subtotal: number
  imageUrl: string | null
}

interface Props {
  items: CartItem[]
  total: number
  cartCount: number
}

export default function CartShow({ items, total, cartCount }: Props) {
  return (
    <Layout cartCount={cartCount}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {items.map((item, index) => (
                <CartItemRow key={item.productId} item={item} isLast={index === items.length - 1} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-indigo-600 text-white text-center py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full text-center py-3 text-indigo-600 hover:text-indigo-800 mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

function CartItemRow({ item, isLast }: { item: CartItem; isLast: boolean }) {
  const updateQuantity = (newQuantity: number) => {
    router.patch('/cart/update', {
      product_id: item.productId,
      quantity: newQuantity
    })
  }

  const removeItem = () => {
    router.delete('/cart/remove', {
      data: { product_id: item.productId }
    })
  }

  return (
    <div className={`p-6 ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className="flex gap-6">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-grow">
          <Link
            href={`/products/${item.productId}`}
            className="text-lg font-medium text-gray-900 hover:text-indigo-600"
          >
            {item.name}
          </Link>
          <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => updateQuantity(Math.max(1, item.quantity - 1))}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(Math.min(item.stock, item.quantity + 1))}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              +
            </button>
            <button
              onClick={removeItem}
              className="ml-4 text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            ${item.subtotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
