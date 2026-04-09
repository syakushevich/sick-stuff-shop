import { Link, useForm } from '@inertiajs/react'
import Layout from '../../components/Layout'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  inStock: boolean
  imageUrl: string | null
}

interface Props {
  products: Product[]
  cartCount: number
}

export default function ProductsIndex({ products, cartCount }: Props) {
  return (
    <Layout cartCount={cartCount}>
      <div>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l-2 border-black dark:border-white">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { post, processing } = useForm()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    post(`/cart/add?product_id=${product.id}&quantity=1`)
  }

  return (
    <div className="border-r-2 border-b-2 border-black dark:border-white">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-square bg-background overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h2 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            {product.name}
          </h2>
        </Link>

        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-foreground font-mono">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm ${product.inStock ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || processing}
          className={`mt-4 w-full py-2 px-4 font-medium font-mono transition-colors ${
            product.inStock
              ? 'bg-primary text-primary-foreground hover:opacity-90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {processing ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}
