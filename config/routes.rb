Rails.application.routes.draw do
  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  # Public routes
  root "products#index"
  resources :products, only: [:index, :show]

  # Cart routes
  resource :cart, only: [:show] do
    post :add
    patch :update
    delete :remove
  end

  # Checkout routes
  resource :checkout, only: [:show, :create]

  # Admin routes
  namespace :admin do
    root "products#index"

    # Admin authentication
    get "login", to: "sessions#new"
    post "login", to: "sessions#create"
    delete "logout", to: "sessions#destroy"

    # Admin resources
    resources :products
    resources :orders, only: [:index, :show, :update]
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
