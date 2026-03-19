require 'rails_helper'

RSpec.describe "Items", type: :request do
  describe "GET /items" do
    it "正常にレスポンスを返す" do
      get items_path
      expect(response).to have_http_status(:ok)
    end

    it "全アイテムを表示する" do
      create(:item, title: "Item A")
      create(:item, title: "Item B")

      get items_path
      expect(response.body).to include("Item A", "Item B")
    end

    context "tag パラメータがある場合" do
      it "該当タグのアイテムのみ返す" do
        tag  = create(:tag, name: "ruby")
        item_with_tag    = create(:item, title: "Rubyの話")
        item_without_tag = create(:item, title: "Pythonの話")
        create(:item_tag, item: item_with_tag, tag: tag)

        get items_path, params: { tag: "ruby" }
        expect(response.body).to include("Rubyの話")
        expect(response.body).not_to include("Pythonの話")
      end

      it "複数タグを渡すと OR フィルタリングされる" do
        tag_ruby  = create(:tag, name: "ruby")
        tag_rails = create(:tag, name: "rails")
        item_ruby  = create(:item, title: "Rubyの話")
        item_rails = create(:item, title: "Railsの話")
        item_other = create(:item, title: "Pythonの話")
        create(:item_tag, item: item_ruby,  tag: tag_ruby)
        create(:item_tag, item: item_rails, tag: tag_rails)

        get items_path, params: { tag: ["ruby", "rails"] }
        expect(response.body).to include("Rubyの話", "Railsの話")
        expect(response.body).not_to include("Pythonの話")
      end
    end
  end

  describe "GET /items/:id" do
    it "正常にレスポンスを返す" do
      item = create(:item)
      get item_path(item)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /items/new" do
    it "正常にレスポンスを返す" do
      get new_item_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /items/:id/edit" do
    it "正常にレスポンスを返す" do
      item = create(:item)
      get edit_item_path(item)
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /items" do
    context "有効なパラメータの場合" do
      it "アイテムを作成してリダイレクトする" do
        expect {
          post items_path, params: { item: { title: "New Item", content: "Content" } }
        }.to change(Item, :count).by(1)

        expect(response).to redirect_to(item_path(Item.last))
      end

      it "tag_names を含めてタグを作成する" do
        post items_path, params: { item: { title: "New Item", content: "Content", tag_names: "ruby, rails" } }
        expect(Item.last.tags.map(&:name)).to match_array(["ruby", "rails"])
      end
    end

    # NOTE: Item モデルに title バリデーションが追加された際にテストを追加する
  end

  describe "PATCH /items/:id" do
    context "有効なパラメータの場合" do
      it "アイテムを更新してリダイレクトする" do
        item = create(:item, title: "Old Title")
        patch item_path(item), params: { item: { title: "New Title" } }

        expect(item.reload.title).to eq("New Title")
        expect(response).to redirect_to(item_path(item))
      end

      it "tag_names を更新するとタグが差し替わる" do
        tag  = create(:tag, name: "ruby")
        item = create(:item)
        create(:item_tag, item: item, tag: tag)

        patch item_path(item), params: { item: { tag_names: "rails" } }
        expect(item.reload.tags.map(&:name)).to eq(["rails"])
      end
    end
  end

  describe "DELETE /items/:id" do
    it "アイテムを削除して /items にリダイレクトする" do
      item = create(:item)
      expect {
        delete item_path(item)
      }.to change(Item, :count).by(-1)

      expect(response).to redirect_to(items_path)
    end

    it "関連する item_tags も削除される" do
      item = create(:item)
      create(:item_tag, item: item, tag: create(:tag))

      expect {
        delete item_path(item)
      }.to change(ItemTag, :count).by(-1)
    end
  end
end
