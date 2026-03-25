require 'rails_helper'

RSpec.describe "Api::V1::Tags", type: :request do
  describe "GET /api/v1/tags" do
    it "タグ一覧をJSON形式で返す" do
      create(:tag, name: "ruby")
      create(:tag, name: "rails")

      get api_v1_tags_path
      json = response.parsed_body
      expect(json.map { |t| t["name"] }).to match_array(["rails", "ruby"])
    end
  end
end
