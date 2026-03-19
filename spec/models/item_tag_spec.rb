require 'rails_helper'

RSpec.describe ItemTag, type: :model do
  describe "バリデーション" do
    it "item と tag の組み合わせが一意なら有効" do
      expect(build(:item_tag)).to be_valid
    end

    it "同じ item と tag の組み合わせは無効" do
      item = create(:item)
      tag  = create(:tag)
      create(:item_tag, item: item, tag: tag)

      expect(build(:item_tag, item: item, tag: tag)).to be_invalid
    end
  end

  describe "アソシエーション" do
    it "item に belongs_to している" do
      item_tag = create(:item_tag)
      expect(item_tag.item).to be_a(Item)
    end

    it "tag に belongs_to している" do
      item_tag = create(:item_tag)
      expect(item_tag.tag).to be_a(Tag)
    end
  end
end
