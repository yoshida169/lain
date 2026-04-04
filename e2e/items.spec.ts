import { expect, test } from "@playwright/test";

test.describe("Items CRUD", () => {
  test.beforeEach(async ({ request }) => {
    // 既存のテスト用データを削除
    const res = await request.get("/api/v1/items");
    const items = await res.json();
    for (const item of items) {
      if (item.title.startsWith("E2Eテスト")) {
        await request.delete(`/api/v1/items/${item.id}`);
      }
    }
  });

  test("Item を作成・表示・編集・削除できる", async ({ page }) => {
    // 一覧ページ
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Items" })).toBeVisible();

    // 作成
    await page.getByRole("link", { name: "新規作成" }).click();
    await expect(page).toHaveURL("/items/new");

    await page.getByLabel("タイトル").fill("E2Eテスト Item");
    await page.getByLabel("内容").fill("Playwright で作成したアイテム");
    await page.getByLabel(/タグ/).fill("e2e, playwright");
    await page.getByRole("button", { name: "保存" }).click();

    // 詳細ページに遷移
    await expect(page.getByRole("heading", { name: "E2Eテスト Item" })).toBeVisible();
    await expect(page.getByText("Playwright で作成したアイテム")).toBeVisible();
    await expect(page.getByText("e2e", { exact: true })).toBeVisible();

    // 編集
    await page.getByRole("link", { name: "編集" }).click();
    await page.getByLabel("タイトル").fill("E2Eテスト Item（編集済み）");
    await page.getByRole("button", { name: "保存" }).click();

    await expect(page.getByRole("heading", { name: "E2Eテスト Item（編集済み）" })).toBeVisible();

    // 削除
    await page.getByRole("button", { name: "削除" }).click();
    await expect(page).toHaveURL("/items");
    await expect(page.getByText("E2Eテスト Item（編集済み）")).not.toBeVisible();
  });
});
