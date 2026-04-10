module Admin
  class DashboardController < BaseController
    def index
      render inertia: "Admin/Dashboard/Index", props: {
        stats: {
          products_count: Product.count,
          orders_count: Order.count,
          total_revenue: Order.sum(:total).to_f
        },
        products: Product.order(created_at: :desc).limit(10).map { |product| product_summary(product) },
        orders: Order.includes(:order_items).order(created_at: :desc).limit(10).map { |order| order_summary(order) }
      }
    end

    private

    def product_summary(product)
      {
        id: product.id,
        name: product.name,
        price: product.price.to_f,
        stock: product.stock,
        image_url: product.images.first ? Rails.application.routes.url_helpers.rails_blob_path(product.images.first, only_path: true) : nil
      }
    end

    def order_summary(order)
      {
        id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total: order.total.to_f,
        status: order.status,
        items_count: order.order_items.count,
        created_at: order.created_at.strftime("%Y-%m-%d %H:%M")
      }
    end
  end
end
