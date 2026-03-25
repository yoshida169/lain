class Api::V1::TagsController < ApplicationController
  def index
    tags = Tag.order(:name)
    render json: tags.map { |tag| { id: tag.id, name: tag.name } }
  end
end
