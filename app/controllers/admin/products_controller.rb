module Admin
  class ProductsController < BaseController
    before_action :set_product, only: [:edit, :update, :destroy]

    def index
      products = Product.all.order(created_at: :desc).map { |product| product_json(product) }

      render inertia: "Admin/Products/Index", props: {
        products: products,
        admin: admin_json
      }
    end

    def new
      render inertia: "Admin/Products/New", props: {
        admin: admin_json
      }
    end

    def create
      product = Product.new(product_params)

      if product.save
        attach_images(product) if params[:images].present?
        redirect_to admin_products_path, notice: "Product created successfully"
      else
        redirect_to new_admin_product_path, alert: product.errors.full_messages.join(", ")
      end
    end

    def edit
      render inertia: "Admin/Products/Edit", props: {
        product: product_json(@product, include_images: true),
        admin: admin_json
      }
    end

    def update
      if @product.update(product_params)
        attach_images(@product) if params[:images].present?
        remove_images(@product) if params[:remove_image_ids].present?
        redirect_to admin_products_path, notice: "Product updated successfully"
      else
        redirect_to edit_admin_product_path(@product), alert: @product.errors.full_messages.join(", ")
      end
    end

    def destroy
      if @product.destroy
        redirect_to admin_products_path, notice: "Product deleted successfully"
      else
        redirect_to admin_products_path, alert: @product.errors.full_messages.join(", ")
      end
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.permit(:name, :description, :price, :stock)
    end

    def attach_images(product)
      Array(params[:images]).each do |image|
        product.images.attach(image)
      end
    end

    def remove_images(product)
      image_ids = Array(params[:remove_image_ids]).map(&:to_i)
      product.images.where(id: image_ids).each(&:purge)
    end

    def product_json(product, include_images: false)
      json = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.to_f,
        stock: product.stock,
        createdAt: product.created_at.strftime("%Y-%m-%d %H:%M")
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

    def admin_json
      {
        email: current_admin.email
      }
    end
  end
end
