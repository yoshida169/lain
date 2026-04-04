require 'rails_helper'

RSpec.describe "Api::V1::Items", type: :request do
  describe "GET /api/v1/items" do
    it "正常にレスポンスを返す" do
      get '/api/v1/items'
      expect(response).to have_http_status(:ok)
    end

    it "全アイテムを返す" do
      create(:item, title: "Item A")
      create(:item, title: "Item B")

      get '/api/v1/items'
      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      titles = json.map { |item| item['title'] }
      expect(titles).to include("Item A", "Item B")
    end

    context "tag パラメータがある場合" do
      it "該当タグのアイテムのみ返す" do
        tag  = create(:tag, name: "ruby")
        item_with_tag    = create(:item, title: "Rubyの話")
        item_without_tag = create(:item, title: "Pythonの話")
        create(:item_tag, item: item_with_tag, tag: tag)

        get '/api/v1/items', params: { tag: ["ruby"] }
        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        titles = json.map { |item| item['title'] }
        expect(titles).to include("Rubyの話")
        expect(titles).not_to include("Pythonの話")
      end

      it "複数タグを渡すと OR フィルタリングされる" do
        tag_ruby  = create(:tag, name: "ruby")
        tag_rails = create(:tag, name: "rails")
        item_ruby  = create(:item, title: "Rubyの話")
        item_rails = create(:item, title: "Railsの話")
        item_other = create(:item, title: "Pythonの話")
        create(:item_tag, item: item_ruby,  tag: tag_ruby)
        create(:item_tag, item: item_rails, tag: tag_rails)

        get '/api/v1/items', params: { tag: ["ruby", "rails"] }
        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        titles = json.map { |item| item['title'] }
        expect(titles).to include("Rubyの話", "Railsの話")
        expect(titles).not_to include("Pythonの話")
      end
    end
  end

  describe "GET /api/v1/items/:id" do
    it "正常にレスポンスを返す" do
      item = create(:item, title: "Test Item")
      get "/api/v1/items/#{item.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['title']).to eq("Test Item")
    end
  end

  describe "POST /api/v1/items" do
    context "有効なパラメータの場合" do
      it "アイテムを作成する" do
        expect {
          post '/api/v1/items', params: { item: { title: "New Item", content: "Content" } }
        }.to change(Item, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "tag_names を含めてタグを作成する" do
        post '/api/v1/items', params: { item: { title: "New Item", content: "Content", tag_names: "ruby, rails" } }

        expect(response).to have_http_status(:created)
        expect(Item.last.tags.map(&:name)).to match_array(["ruby", "rails"])
      end
    end
  end

  describe "PATCH /api/v1/items/:id" do
    context "有効なパラメータの場合" do
      it "アイテムを更新する" do
        item = create(:item, title: "Old Title")
        patch "/api/v1/items/#{item.id}", params: { item: { title: "New Title" } }

        expect(response).to have_http_status(:ok)
        expect(item.reload.title).to eq("New Title")
      end

      it "tag_names を更新するとタグが差し替わる" do
        tag  = create(:tag, name: "ruby")
        item = create(:item)
        create(:item_tag, item: item, tag: tag)

        patch "/api/v1/items/#{item.id}", params: { item: { tag_names: "rails" } }

        expect(response).to have_http_status(:ok)
        expect(item.reload.tags.map(&:name)).to eq(["rails"])
      end
    end
  end

  describe "DELETE /api/v1/items/:id" do
    it "アイテムを削除する" do
      item = create(:item)
      expect {
        delete "/api/v1/items/#{item.id}"
      }.to change(Item, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "関連する item_tags も削除される" do
      item = create(:item)
      create(:item_tag, item: item, tag: create(:tag))

      expect {
        delete "/api/v1/items/#{item.id}"
      }.to change(ItemTag, :count).by(-1)
    end
  end
end
