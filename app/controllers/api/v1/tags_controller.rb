class Api::V1::TagsController < Api::V1::BaseController
  def index
    tags = Tag.order(:name)
    render json: tags.map { |tag| { id: tag.id, name: tag.name } }
  end
end
