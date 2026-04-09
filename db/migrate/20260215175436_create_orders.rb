class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.string :status, default: 'pending', null: false
      t.string :customer_name, null: false
      t.string :customer_email, null: false
      t.string :customer_phone
      t.text :shipping_address, null: false
      t.text :billing_address
      t.decimal :total, precision: 10, scale: 2, null: false

      t.timestamps
    end

    add_index :orders, :status
  end
end
