class ItemsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "items_channel"
  end
end
