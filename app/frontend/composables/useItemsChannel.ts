import { createConsumer } from "@rails/actioncable";
import { onUnmounted } from "vue";
import type { Item } from "../api/items";

type Callbacks = {
  onCreated: (item: Item) => void;
  onUpdated: (item: Item) => void;
  onDeleted: (id: number) => void;
};

export function useItemsChannel(callbacks: Callbacks) {
  const consumer = createConsumer();

  const subscription = consumer.subscriptions.create("ItemsChannel", {
    received(data: { event: string; item: Item & { id: number } }) {
      if (data.event === "created") {
        callbacks.onCreated(data.item);
      } else if (data.event === "updated") {
        callbacks.onUpdated(data.item);
      } else if (data.event === "deleted") {
        callbacks.onDeleted(data.item.id);
      }
    },
  });

  onUnmounted(() => {
    subscription.unsubscribe();
    consumer.disconnect();
  });
}
