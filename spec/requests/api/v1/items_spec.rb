require 'rails_helper'

RSpec.describe "Api::V1::Items", type: :request do
  describe "GET /api/v1/items" do
    it "正常にレスポンスを返す" do
      get api_v1_items_path
      expect(response).to have_http_status(:ok)
    end

    it "全アイテムをJSON形式で返す" do
      create(:item, title: "Item A")
      create(:item, title: "Item B")

      get api_v1_items_path
      json = response.parsed_body
      expect(json.map { |i| i["title"] }).to match_array(["Item A", "Item B"])
    end

    context "tag パラメータがある場合" do
      it "該当タグのアイテムのみ返す" do
        tag = create(:tag, name: "ruby")
        item_with_tag    = create(:item, title: "Rubyの話")
        item_without_tag = create(:item, title: "Pythonの話")
        create(:item_tag, item: item_with_tag, tag: tag)

        get api_v1_items_path, params: { tag: "ruby" }
        json = response.parsed_body
        expect(json.map { |i| i["title"] }).to include("Rubyの話")
        expect(json.map { |i| i["title"] }).not_to include("Pythonの話")
      end
    end
  end

  describe "GET /api/v1/items/:id" do
    it "アイテムをタグ付きで返す" do
      tag  = create(:tag, name: "ruby")
      item = create(:item, title: "Rubyの話")
      create(:item_tag, item: item, tag: tag)

      get api_v1_item_path(item)
      json = response.parsed_body
      expect(json["title"]).to eq("Rubyの話")
      expect(json["tags"].map { |t| t["name"] }).to include("ruby")
    end
  end

  describe "POST /api/v1/items" do
    it "アイテムを作成する" do
      expect {
        post api_v1_items_path,
          params: { item: { title: "New Item", content: "Content", tag_names: "ruby" } },
          as: :json
      }.to change(Item, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["title"]).to eq("New Item")
    end
  end

  describe "PATCH /api/v1/items/:id" do
    it "アイテムを更新する" do
      item = create(:item, title: "Old Title")
      patch api_v1_item_path(item),
        params: { item: { title: "New Title" } },
        as: :json

      expect(response).to have_http_status(:ok)
      expect(item.reload.title).to eq("New Title")
    end
  end

  describe "DELETE /api/v1/items/:id" do
    it "アイテムを削除する" do
      item = create(:item)
      expect {
        delete api_v1_item_path(item), as: :json
      }.to change(Item, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
