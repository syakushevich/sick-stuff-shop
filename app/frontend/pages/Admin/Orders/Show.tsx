import { Link, useForm } from '@inertiajs/react'
import AdminLayout from '../../../components/AdminLayout'

interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

interface Order {
  id: number
  status: string
  statusLabel: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: string
  billingAddress: string | null
  total: number
  createdAt: string
  items: OrderItem[]
}

interface Admin {
  email: string
}

interface Props {
  order: Order
  statuses: string[]
  admin: Admin
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function AdminOrdersShow({ order, statuses, admin }: Props) {
  const { data, setData, patch, processing } = useForm({
    status: order.status
  })

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData('status', e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patch(`/admin/orders/${order.id}`)
  }

  return (
    <AdminLayout admin={admin}>
      <div className="mb-6">
        <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">Placed on {order.createdAt}</p>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
          {order.statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/products/${item.productId}/edit`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        {item.productName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-gray-900 mt-1">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-gray-900 mt-1">{order.customerEmail}</dd>
              </div>
              {order.customerPhone && (
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="text-gray-900 mt-1">{order.customerPhone}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-gray-500">Shipping Address</dt>
                <dd className="text-gray-900 mt-1 whitespace-pre-wrap">{order.shippingAddress}</dd>
              </div>
              {order.billingAddress && (
                <div>
                  <dt className="text-sm text-gray-500">Billing Address</dt>
                  <dd className="text-gray-900 mt-1 whitespace-pre-wrap">{order.billingAddress}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Status Update */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  id="status"
                  value={data.status}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={processing || data.status === order.status}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update Status'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
