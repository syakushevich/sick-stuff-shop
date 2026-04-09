import { Link } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface CustomerInfo {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  billing_address: string
}

interface Props {
  message: string
  customerInfo: CustomerInfo
  cartCount: number
}

export default function CheckoutPlaceholder({ message, customerInfo, cartCount }: Props) {
  return (
    <Layout cartCount={cartCount}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{message}</h1>

          <p className="text-gray-600 mb-8">
            We've received your information and will process your order once payment integration is complete.
          </p>

          {/* Customer Info Summary */}
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-gray-900">{customerInfo.customer_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-gray-900">{customerInfo.customer_email}</dd>
              </div>
              {customerInfo.customer_phone && (
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="text-gray-900">{customerInfo.customer_phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">Shipping Address</dt>
                <dd className="text-gray-900 whitespace-pre-wrap">{customerInfo.shipping_address}</dd>
              </div>
              {customerInfo.billing_address && (
                <div>
                  <dt className="text-sm text-gray-500">Billing Address</dt>
                  <dd className="text-gray-900 whitespace-pre-wrap">{customerInfo.billing_address}</dd>
                </div>
              )}
            </dl>
          </div>

          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  )
}
