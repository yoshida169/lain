import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import ItemForm from "../ItemForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/:pathMatch(.*)*", component: { template: "<div/>" } }],
});

describe("ItemForm", () => {
  it("空のフォームを表示する", () => {
    const wrapper = mount(ItemForm, {
      global: { plugins: [router] },
    });
    expect(wrapper.find("#item-title").exists()).toBe(true);
    expect(wrapper.find("#item-content").exists()).toBe(true);
    expect(wrapper.find("#item-tag-names").exists()).toBe(true);
  });

  it("initial が渡された場合は初期値が入力される", () => {
    const initial = {
      id: 1,
      title: "既存タイトル",
      content: "既存コンテンツ",
      tag_names: "ruby",
      tags: [],
      created_at: "",
      updated_at: "",
    };
    const wrapper = mount(ItemForm, {
      props: { initial },
      global: { plugins: [router] },
    });
    expect(
      (wrapper.find("#item-title").element as HTMLInputElement).value,
    ).toBe("既存タイトル");
    expect(
      (wrapper.find("#item-content").element as HTMLTextAreaElement).value,
    ).toBe("既存コンテンツ");
  });

  it("フォーム送信で submit イベントを emit する", async () => {
    const wrapper = mount(ItemForm, {
      global: { plugins: [router] },
    });
    await wrapper.find("#item-title").setValue("新しいタイトル");
    await wrapper.find("#item-content").setValue("新しいコンテンツ");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.emitted("submit")).toBeTruthy();
    expect(wrapper.emitted("submit")?.[0][0]).toMatchObject({
      title: "新しいタイトル",
      content: "新しいコンテンツ",
    });
  });
});
