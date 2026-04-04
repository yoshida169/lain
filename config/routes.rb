Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :items
      resources :tags, only: [:index]
    end
  end

  get '/items', to: 'vue#index'
  get '/items/*path', to: 'vue#index'
  root to: 'vue#index'
end
