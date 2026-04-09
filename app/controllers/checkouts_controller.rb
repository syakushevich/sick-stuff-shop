class CheckoutsController < ApplicationController
  def show
    # Check if this is a "buy now" for a single product
    if params[:product_id].present?
      product = Product.find(params[:product_id])
      quantity = (params[:quantity] || 1).to_i

      items = [{
        productId: product.id,
        name: product.name,
        price: product.price.to_f,
        quantity: quantity,
        subtotal: (product.price * quantity).to_f
      }]
      total = product.price * quantity
      buy_now = true
    else
      # Checkout from cart
      items = cart_items
      total = items.sum { |item| item[:subtotal] }
      buy_now = false
    end

    render inertia: "Checkout/Show", props: {
      items: items,
      total: total.to_f,
      buyNow: buy_now,
      productId: params[:product_id],
      quantity: params[:quantity],
      cartCount: cart_count
    }
  end

  def create
    # For now, just show the placeholder page
    # Stripe integration will be added later

    render inertia: "Checkout/Placeholder", props: {
      message: "Payment integration coming soon!",
      customerInfo: checkout_params.to_h,
      cartCount: cart_count
    }
  end

  private

  def checkout_params
    params.permit(:customer_name, :customer_email, :customer_phone, :shipping_address, :billing_address)
  end

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
        subtotal: (product.price * quantity).to_f
      }
    end.compact
  end
end
