import { expect, test } from "@playwright/test";

test.describe("タグフィルタリング", () => {
  test.beforeEach(async ({ page }) => {
    // テスト用 Item を作成
    await page.goto("/items/new");
    await page.getByLabel("タイトル").fill("タグフィルタ用 Item A");
    await page.getByLabel("内容").fill("content A");
    await page.getByLabel(/タグ/).fill("filter-tag");
    await page.getByRole("button", { name: "保存" }).click();

    await page.goto("/items/new");
    await page.getByLabel("タイトル").fill("タグフィルタ用 Item B");
    await page.getByLabel("内容").fill("content B");
    await page.getByLabel(/タグ/).fill("other-tag");
    await page.getByRole("button", { name: "保存" }).click();
  });

  test("タグをクリックすると該当 Item のみ表示される", async ({ page }) => {
    await page.goto("/");

    // filter-tag をクリック
    await page.getByRole("button", { name: "filter-tag" }).click();

    await expect(page.getByText("タグフィルタ用 Item A")).toBeVisible();
    await expect(page.getByText("タグフィルタ用 Item B")).not.toBeVisible();

    // もう一度クリックで解除
    await page.getByRole("button", { name: "filter-tag" }).click();
    await expect(page.getByText("タグフィルタ用 Item B")).toBeVisible();
  });
});
