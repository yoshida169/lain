require 'rails_helper'

RSpec.describe Item, type: :model do
  describe "アソシエーション" do
    it "item_tags を複数持つ" do
      item = create(:item)
      tag1 = create(:tag)
      tag2 = create(:tag)
      create(:item_tag, item: item, tag: tag1)
      create(:item_tag, item: item, tag: tag2)

      expect(item.item_tags.count).to eq(2)
    end

    it "tags に through でアクセスできる" do
      item = create(:item)
      tag  = create(:tag)
      create(:item_tag, item: item, tag: tag)

      expect(item.tags).to include(tag)
    end

    it "destroy すると item_tags も削除される" do
      item = create(:item)
      create(:item_tag, item: item, tag: create(:tag))

      expect { item.destroy }.to change(ItemTag, :count).by(-1)
    end
  end

  describe "#tag_names" do
    it "タグ名をカンマ区切りで返す" do
      item = create(:item)
      tag1 = create(:tag, name: "ruby")
      tag2 = create(:tag, name: "rails")
      create(:item_tag, item: item, tag: tag1)
      create(:item_tag, item: item, tag: tag2)

      expect(item.tag_names).to eq("ruby, rails")
    end

    it "タグがない場合は空文字を返す" do
      item = create(:item)
      expect(item.tag_names).to eq("")
    end
  end

  describe "#tag_names=" do
    it "カンマ区切り文字列からタグを設定できる" do
      item = create(:item)
      item.tag_names = "ruby, rails"
      item.save!

      expect(item.tags.map(&:name)).to match_array(["ruby", "rails"])
    end

    it "存在しないタグは新規作成される" do
      item = create(:item)
      expect { item.tag_names = "newtag" }.to change(Tag, :count).by(1)
    end

    it "既存のタグは再利用される" do
      create(:tag, name: "ruby")
      item = create(:item)
      expect { item.tag_names = "ruby" }.not_to change(Tag, :count)
    end

    it "空文字列を渡すとタグがクリアされる" do
      item = create(:item)
      tag  = create(:tag, name: "ruby")
      create(:item_tag, item: item, tag: tag)

      item.tag_names = ""
      item.save!

      expect(item.tags).to be_empty
    end

    it "前後の空白はトリムされる" do
      item = create(:item)
      item.tag_names = "  ruby  ,  rails  "
      item.save!

      expect(item.tags.map(&:name)).to match_array(["ruby", "rails"])
    end

    it "空の要素は無視される" do
      item = create(:item)
      item.tag_names = "ruby,,"
      item.save!

      expect(item.tags.map(&:name)).to eq(["ruby"])
    end
  end
end
