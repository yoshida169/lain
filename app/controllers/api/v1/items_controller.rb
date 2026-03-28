class Api::V1::ItemsController < ApplicationController
  before_action :set_item, only: [:show, :update, :destroy]

  def index
    if params[:tag].present?
      tag_names = Array(params[:tag])
      items = Item.joins(:tags) .where(tags: { name: tag_names }).distinct
    else
      items = Item.all
    end
    render json: items.map { |item| item_json(item) }
  end

  def show
    render json: item_json(@item)
  end

  def create
    @item = Item.new(item_params)
    if @item.save
      render json: item_json(@item), status: :created
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @item.update(item_params)
      render json: item_json(@item)
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @item.destroy
    head :no_content
  end

  private

  def set_item
    @item = Item.find_by(id: params[:id])
    render_not_found unless @item
  end

  def item_params
    params.require(:item).permit(:title, :content, :tag_names)
  end

  def item_json(item)
    {
      id: item.id,
      title: item.title,
      content: item.content,
      tag_names: item.tag_names,
      tags: item.tags.map { |tag| { id: tag.id, name: tag.name } },
      created_at: item.created_at,
      updated_at: item.updated_at
    }
  end
end
