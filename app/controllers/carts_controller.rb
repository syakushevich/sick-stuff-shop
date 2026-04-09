class CartsController < ApplicationController
  def show
    items = cart_items

    render inertia: "Cart/Show", props: {
      items: items,
      total: items.sum { |item| item[:subtotal] },
      cartCount: cart_count
    }
  end

  def add
    product = Product.find(params[:product_id])
    quantity = (params[:quantity] || 1).to_i

    if product.in_stock?
      product_id = product.id.to_s
      cart[product_id] = (cart[product_id] || 0) + quantity

      redirect_back fallback_location: products_path, notice: "#{product.name} added to cart"
    else
      redirect_back fallback_location: products_path, alert: "Product is out of stock"
    end
  end

  def update
    product_id = params[:product_id].to_s
    quantity = params[:quantity].to_i

    if quantity > 0
      cart[product_id] = quantity
    else
      cart.delete(product_id)
    end

    redirect_to cart_path
  end

  def remove
    product_id = params[:product_id].to_s
    cart.delete(product_id)

    redirect_to cart_path
  end

  private

  def cart_items
    return [] if cart.empty?

    product_ids = cart.keys.map(&:to_i)
    products = Product.where(id: product_ids).index_by(&:id)

    cart.map do |product_id, quantity|
      product = products[product_id.to_i]
      next unless product

      {
        productId: product.id,
        name: product.name,
        price: product.price.to_f,
        quantity: quantity,
        stock: product.stock,
        subtotal: (product.price * quantity).to_f,
        imageUrl: product.images.first ? Rails.application.routes.url_helpers.rails_blob_path(product.images.first, only_path: true) : nil
      }
    end.compact
  end
end
