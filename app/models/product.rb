class Product < ApplicationRecord
  has_many_attached :images do |attachable|
    attachable.variant :thumb, resize_to_limit: [ 200, 200 ]
    attachable.variant :medium, resize_to_limit: [ 500, 500 ]
  end

  has_many :order_items, dependent: :restrict_with_error

  # Scope to get images ordered by position
  scope :ordered_images, -> { images.order(position: :asc) }

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :in_stock, -> { where("stock > 0") }

  def in_stock?
    stock > 0
  end
end
