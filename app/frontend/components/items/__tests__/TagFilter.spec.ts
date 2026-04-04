import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TagFilter from "../TagFilter.vue";

const tags = [
  { id: 1, name: "ruby" },
  { id: 2, name: "rails" },
];

describe("TagFilter", () => {
  it("タグボタンを表示する", () => {
    const wrapper = mount(TagFilter, {
      props: { tags, selected: [] },
    });
    expect(wrapper.text()).toContain("ruby");
    expect(wrapper.text()).toContain("rails");
  });

  it("選択済みタグはアクティブスタイルになる", () => {
    const wrapper = mount(TagFilter, {
      props: { tags, selected: ["ruby"] },
    });
    const buttons = wrapper.findAll("button");
    expect(buttons[0].classes()).toContain("bg-indigo-600");
    expect(buttons[1].classes()).not.toContain("bg-indigo-600");
  });

  it("タグをクリックすると change イベントを emit する", async () => {
    const wrapper = mount(TagFilter, {
      props: { tags, selected: [] },
    });
    await wrapper.findAll("button")[0].trigger("click");
    expect(wrapper.emitted("change")).toBeTruthy();
    expect(wrapper.emitted("change")?.[0]).toEqual([["ruby"]]);
  });

  it("選択済みタグをクリックすると選択を解除する", async () => {
    const wrapper = mount(TagFilter, {
      props: { tags, selected: ["ruby"] },
    });
    await wrapper.findAll("button")[0].trigger("click");
    expect(wrapper.emitted("change")?.[0]).toEqual([[]]);
  });
});
