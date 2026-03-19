FactoryBot.define do
  factory :item do
    sequence(:title) { |n| "Item #{n}" }
    content { "Some content" }
  end
end
