class ProductsController < ApplicationController
  def index
    products = Product.all.map { |product| product_json(product) }

    render inertia: "Products/Index", props: {
      products: products,
      cartCount: cart_count
    }
  end

  def show
    product = Product.find(params[:id])

    render inertia: "Products/Show", props: {
      product: product_json(product, include_images: true),
      cartCount: cart_count
    }
  end

  private

  def product_json(product, include_images: false)
    json = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.to_f,
      stock: product.stock,
      inStock: product.in_stock?
    }

    if include_images
      json[:images] = product.images.map do |image|
        {
          id: image.id,
          url: Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)
        }
      end
    else
      json[:imageUrl] = product.images.first ? Rails.application.routes.url_helpers.rails_blob_path(product.images.first, only_path: true) : nil
    end

    json
  end
end
