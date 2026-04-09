class Order < ApplicationRecord
  STATUSES = %w[pending paid shipped delivered cancelled].freeze

  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items

  validates :status, presence: true, inclusion: { in: STATUSES }
  validates :customer_name, presence: true
  validates :customer_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :shipping_address, presence: true
  validates :total, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :by_status, ->(status) { where(status: status) if status.present? }
  scope :recent, -> { order(created_at: :desc) }

  def status_label
    status.titleize
  end
end
