module Admin
  class ProductsController < BaseController
    before_action :set_product, only: [ :edit, :update, :destroy, :reorder_images ]

    def index
      products = Product.all.order(created_at: :desc).map { |product| product_json(product) }

      render inertia: "Admin/Products/Index", props: {
        products: products
      }
    end

    def new
      render inertia: "Admin/Products/New"
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
        product: product_json(@product, include_images: true)
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

    def reorder_images
      image_order = params[:image_order] || []

      # Reorder images by changing their position
      image_order.each_with_index do |image_id, index|
        attachment = @product.images.find_by(id: image_id)
        if attachment
          # Update position in the attachment record
          ActiveStorage::Attachment.where(id: attachment.id).update_all(position: index)
        end
      end

      head :ok
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.permit(:name, :description, :price, :stock)
    end

    def attach_images(product)
      current_max_position = product.images.maximum(:position) || -1

      Array(params[:images]).each_with_index do |image, index|
        attachment = product.images.attach(image)
        # Set position for the newly attached image
        if attachment.is_a?(Array)
          attachment.each_with_index do |att, i|
            ActiveStorage::Attachment.where(id: att.id).update_all(position: current_max_position + index + i + 1)
          end
        else
          ActiveStorage::Attachment.where(id: attachment.id).update_all(position: current_max_position + index + 1)
        end
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
        json[:images] = product.images.order(position: :asc, created_at: :asc).map do |image|
          {
            id: image.id,
            url: Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true),
            position: image.position || 0
          }
        end
      else
        first_image = product.images.order(position: :asc, created_at: :asc).first
        json[:imageUrl] = first_image ? Rails.application.routes.url_helpers.rails_blob_path(first_image, only_path: true) : nil
      end

      json
    end
  end
end
