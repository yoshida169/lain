import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Item } from "../../api/items";
import { useItemsChannel } from "../useItemsChannel";

const mockUnsubscribe = vi.fn();
const mockDisconnect = vi.fn();
let receivedCallback: (data: unknown) => void;

vi.mock("@rails/actioncable", () => ({
  createConsumer: () => ({
    subscriptions: {
      create: (
        _channel: string,
        mixin: { received: (data: unknown) => void },
      ) => {
        receivedCallback = mixin.received;
        return { unsubscribe: mockUnsubscribe };
      },
    },
    disconnect: mockDisconnect,
  }),
}));

let unmountHook: (() => void) | undefined;
vi.mock("vue", () => ({
  onUnmounted: (fn: () => void) => {
    unmountHook = fn;
  },
}));

const item: Item = {
  id: 1,
  title: "テスト",
  content: "テスト内容",
  tag_names: "ruby",
  tags: [{ id: 1, name: "ruby" }],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("useItemsChannel", () => {
  const callbacks = {
    onCreated: vi.fn(),
    onUpdated: vi.fn(),
    onDeleted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    unmountHook = undefined;
    useItemsChannel(callbacks);
  });

  it("created イベントで onCreated コールバックを呼ぶ", () => {
    receivedCallback({ event: "created", item });

    expect(callbacks.onCreated).toHaveBeenCalledWith(item);
    expect(callbacks.onUpdated).not.toHaveBeenCalled();
    expect(callbacks.onDeleted).not.toHaveBeenCalled();
  });

  it("updated イベントで onUpdated コールバックを呼ぶ", () => {
    receivedCallback({ event: "updated", item });

    expect(callbacks.onUpdated).toHaveBeenCalledWith(item);
    expect(callbacks.onCreated).not.toHaveBeenCalled();
    expect(callbacks.onDeleted).not.toHaveBeenCalled();
  });

  it("deleted イベントで onDeleted コールバックを id で呼ぶ", () => {
    receivedCallback({ event: "deleted", item });

    expect(callbacks.onDeleted).toHaveBeenCalledWith(1);
    expect(callbacks.onCreated).not.toHaveBeenCalled();
    expect(callbacks.onUpdated).not.toHaveBeenCalled();
  });

  it("不明なイベントではコールバックを呼ばない", () => {
    receivedCallback({ event: "unknown", item });

    expect(callbacks.onCreated).not.toHaveBeenCalled();
    expect(callbacks.onUpdated).not.toHaveBeenCalled();
    expect(callbacks.onDeleted).not.toHaveBeenCalled();
  });

  it("アンマウント時に購読解除と切断を行う", () => {
    expect(unmountHook).toBeDefined();
    unmountHook!();

    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
