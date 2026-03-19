class Item < ApplicationRecord
  has_many :item_tags, dependent: :destroy
  has_many :tags, through: :item_tags

  def tag_names
    tags.map(&:name).join(", ")
  end

  def tag_names=(names_string)
    tag_list = names_string.to_s.split(",").map(&:strip).reject(&:blank?)
    self.tags = tag_list.map { |name| Tag.find_or_create_by!(name: name) }
  end
end
