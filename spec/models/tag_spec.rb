require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe "バリデーション" do
    it "name があれば有効" do
      expect(build(:tag)).to be_valid
    end

    it "name が空なら無効" do
      expect(build(:tag, name: "")).to be_invalid
    end

    it "name が重複したら無効" do
      create(:tag, name: "ruby")
      expect(build(:tag, name: "ruby")).to be_invalid
    end
  end

  describe "アソシエーション" do
    it "item_tags を複数持つ" do
      tag = create(:tag)
      item1 = create(:item)
      item2 = create(:item)
      create(:item_tag, item: item1, tag: tag)
      create(:item_tag, item: item2, tag: tag)

      expect(tag.item_tags.count).to eq(2)
    end

    it "items に through でアクセスできる" do
      tag = create(:tag)
      item = create(:item)
      create(:item_tag, item: item, tag: tag)

      expect(tag.items).to include(item)
    end

    it "item_tag を削除すると item_tags も削除される" do
      tag = create(:tag)
      item = create(:item)
      create(:item_tag, item: item, tag: tag)

      expect { tag.destroy }.to change(ItemTag, :count).by(-1)
    end
  end
end
