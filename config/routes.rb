Rails.application.routes.draw do
  resources :items

  namespace :api do
    namespace :v1 do
      resources :items
      resources :tags, only: [:index]
    end
  end

  get 'vue/*path', to: 'vue#index'
  get 'vue', to: 'vue#index'
end
