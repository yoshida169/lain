class Api::V1::BaseController < ApplicationController
  skip_before_action :verify_authenticity_token

  private

  def render_not_found
    render json: { error: "Not found" }, status: :not_found
  end

  def render_unprocessable(resource)
    render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
  end
end
