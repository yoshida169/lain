require 'rails_helper'

RSpec.describe ItemsChannel, type: :channel do
  describe "#subscribed" do
    it "items_channel に購読する" do
      subscribe
      expect(subscription).to be_confirmed
      expect(subscription).to have_stream_from("items_channel")
    end
  end
end
