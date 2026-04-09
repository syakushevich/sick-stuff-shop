import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../components/Layout'

interface ProductImage {
  id: number
  url: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  inStock: boolean
  images: ProductImage[]
}

interface Props {
  product: Product
  cartCount: number
}

export default function ProductShow({ product, cartCount }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { post, processing } = useForm()

  const handleAddToCart = () => {
    post(`/cart/add?product_id=${product.id}&quantity=1`)
  }

  const handleBuyNow = () => {
    window.location.href = `/checkout?product_id=${product.id}&quantity=1`
  }

  const selectedImage = product.images[selectedImageIndex]

  return (
    <Layout cartCount={cartCount} showBack>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-0">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-background overflow-hidden mb-4 flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors flex items-center justify-center bg-background ${
                    index === selectedImageIndex
                      ? 'border-primary'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Black divider - mobile only, full width */}
        <div className="lg:hidden border-b-2 border-black dark:border-white -mx-4 col-span-full" />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-foreground font-mono">
              ${product.price.toFixed(2)}
            </span>
            <span className={`px-3 py-1 text-sm font-medium ${
              product.inStock
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          {/* Description - hidden on mobile, shown on desktop */}
          <div className="hidden lg:block mb-8">
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>

          {product.inStock && (
            <div className="flex flex-col lg:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={processing}
                className="w-full lg:flex-1 py-3 px-6 font-medium font-mono border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {processing ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full lg:flex-1 py-3 px-6 font-medium font-mono bg-primary text-primary-foreground hover:opacity-90 transition-colors"
              >
                Buy Now
              </button>
            </div>
          )}

          {!product.inStock && (
            <div className="bg-muted p-4 text-center text-muted-foreground">
              This product is currently out of stock.
            </div>
          )}

          {/* Description - mobile only, below buttons */}
          <div className="lg:hidden mt-6">
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
