# Create default admin user
AdminUser.find_or_create_by!(email: "admin@example.com") do |admin|
  admin.password = "password123"
  puts "Created admin user: admin@example.com / password123"
end

# Create some sample products for development
if Rails.env.development?
  puts "Creating sample products..."

  5.times do |i|
    Product.find_or_create_by!(name: "Sample Product #{i + 1}") do |product|
      product.description = "This is a sample product description for product #{i + 1}. It has many great features!"
      product.price = (rand(10..100) + rand).round(2)
      product.stock = rand(0..50)
    end
  end

  puts "Sample products created!"
end
