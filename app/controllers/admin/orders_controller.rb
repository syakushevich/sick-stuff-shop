module Admin
  class OrdersController < BaseController
    before_action :set_order, only: [:show, :update]

    def index
      orders = Order.recent.includes(:order_items, :products).map { |order| order_json(order) }

      render inertia: "Admin/Orders/Index", props: {
        orders: orders,
        statuses: Order::STATUSES,
        admin: admin_json
      }
    end

    def show
      render inertia: "Admin/Orders/Show", props: {
        order: order_json(@order, include_items: true),
        statuses: Order::STATUSES,
        admin: admin_json
      }
    end

    def update
      if @order.update(order_params)
        redirect_to admin_order_path(@order), notice: "Order updated successfully"
      else
        redirect_to admin_order_path(@order), alert: @order.errors.full_messages.join(", ")
      end
    end

    private

    def set_order
      @order = Order.find(params[:id])
    end

    def order_params
      params.permit(:status)
    end

    def order_json(order, include_items: false)
      json = {
        id: order.id,
        status: order.status,
        statusLabel: order.status_label,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        billingAddress: order.billing_address,
        total: order.total.to_f,
        createdAt: order.created_at.strftime("%Y-%m-%d %H:%M"),
        itemCount: order.order_items.size
      }

      if include_items
        json[:items] = order.order_items.includes(:product).map do |item|
          {
            id: item.id,
            productId: item.product_id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price.to_f,
            subtotal: item.subtotal.to_f
          }
        end
      end

      json
    end

    def admin_json
      {
        email: current_admin.email
      }
    end
  end
end
