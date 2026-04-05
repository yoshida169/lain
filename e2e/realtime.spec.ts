import { type Browser, expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

/** アイテム一覧ページを開き、初回 API フェッチ完了まで待つ */
async function openItemsPage(browser: Browser) {
  const ctx = await browser.newContext({ baseURL: BASE_URL });
  const page = await ctx.newPage();
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/v1/items") && r.status() === 200),
    page.goto("/items"),
  ]);
  return { ctx, page };
}

/** ブラウザ経由でアイテムを作成し、詳細ページ表示後にコンテキストを閉じる */
async function createItemViaUI(browser: Browser, title: string, content: string) {
  const ctx = await browser.newContext({ baseURL: BASE_URL });
  const page = await ctx.newPage();
  await page.goto("/items/new");
  await page.getByLabel("タイトル").fill(title);
  await page.getByLabel("内容").fill(content);
  await page.getByLabel(/タグ/).fill("");
  await page.getByRole("button", { name: "保存" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await ctx.close();
}

test.describe("リアルタイム更新（WebSocket）", () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get("/api/v1/items");
    const items = await res.json();
    for (const item of items) {
      if (item.title.startsWith("RT用")) {
        await request.delete(`/api/v1/items/${item.id}`);
      }
    }
  });

  test("別タブで作成した Item がリアルタイムに一覧へ表示される", async ({
    browser,
  }) => {
    // タブA: 一覧ページを開き WebSocket 接続を待つ
    const { ctx: ctxA, page: pageA } = await openItemsPage(browser);
    await expect(pageA.getByRole("heading", { name: "Items" })).toBeVisible();

    // 作成前の件数を記録
    const countBefore = await pageA.getByRole("heading", { name: "RT用 新規アイテム", level: 2 }).count();

    // タブB: Item を作成
    const ctxB = await browser.newContext({ baseURL: BASE_URL });
    const pageB = await ctxB.newPage();
    await pageB.goto("/items/new");
    await pageB.getByLabel("タイトル").fill("RT用 新規アイテム");
    await pageB.getByLabel("内容").fill("リアルタイムで表示される");
    await pageB.getByLabel(/タグ/).fill("realtime");
    await pageB.getByRole("button", { name: "保存" }).click();
    await expect(
      pageB.getByRole("heading", { name: "RT用 新規アイテム" }),
    ).toBeVisible();

    // タブA: リロードせずに件数が 1 増える
    await expect(
      pageA.getByRole("heading", { name: "RT用 新規アイテム", level: 2 }),
    ).toHaveCount(countBefore + 1, { timeout: 5000 });

    await ctxA.close();
    await ctxB.close();
  });

  test("別タブで更新した Item がリアルタイムに一覧へ反映される", async ({
    browser,
  }) => {
    // 事前にアイテムを作成
    await createItemViaUI(browser, "RT用 更新前", "更新前の内容");

    // タブA: 一覧ページを開く
    const { ctx: ctxA, page: pageA } = await openItemsPage(browser);
    await expect(pageA.getByText("RT用 更新前")).toBeVisible();

    // タブB: Item を編集
    const ctxB = await browser.newContext({ baseURL: BASE_URL });
    const pageB = await ctxB.newPage();
    await pageB.goto("/items");
    await pageB.waitForResponse((r) => r.url().includes("/api/v1/items") && r.status() === 200);
    await pageB.getByText("RT用 更新前").click();
    await pageB.getByRole("link", { name: "編集" }).click();
    await pageB.getByLabel("タイトル").fill("RT用 更新後");
    await pageB.getByRole("button", { name: "保存" }).click();
    await expect(
      pageB.getByRole("heading", { name: "RT用 更新後" }),
    ).toBeVisible();

    // タブA: リロードせずにタイトルが更新される
    await expect(pageA.getByText("RT用 更新後")).toBeVisible({ timeout: 5000 });
    await expect(pageA.getByText("RT用 更新前")).not.toBeVisible();

    await ctxA.close();
    await ctxB.close();
  });

  test("別タブで削除した Item がリアルタイムに一覧から消える", async ({
    browser,
  }) => {
    // 事前にアイテムを作成
    await createItemViaUI(browser, "RT用 削除対象", "削除される");

    // タブA: 一覧ページを開く
    const { ctx: ctxA, page: pageA } = await openItemsPage(browser);
    await expect(pageA.getByText("RT用 削除対象")).toBeVisible();

    // タブB: Item を削除
    const ctxB = await browser.newContext({ baseURL: BASE_URL });
    const pageB = await ctxB.newPage();
    await pageB.goto("/items");
    await pageB.waitForResponse((r) => r.url().includes("/api/v1/items") && r.status() === 200);
    await pageB.getByText("RT用 削除対象").click();
    await pageB.getByRole("button", { name: "削除" }).click();
    await expect(pageB).toHaveURL("/items");

    // タブA: リロードせずに Item が消える
    await expect(pageA.getByText("RT用 削除対象")).not.toBeVisible({
      timeout: 5000,
    });

    await ctxA.close();
    await ctxB.close();
  });
});
