# Vue.js 移行チェックリスト

Hotwire (Turbo + Stimulus) + Importmap から Vue.js + Vite へ段階的に移行するためのチェックリスト。

## Phase 1: 基盤構築（Node.js + Vite + ツールチェーン）✅

ユーザー影響なし。ビルド基盤のみ整備する。

- [x] Dockerfile に Node.js 24 を追加（非 root ユーザー `app` で実行）
- [x] `vite_rails` gem を Gemfile に追加 → `bundle exec vite install` で自動生成
- [x] `package.json` を作成（vue, vite, @vitejs/plugin-vue, typescript, tailwindcss, @tailwindcss/vite, biome, vitest, playwright 等）
- [x] `bundle install` + `npm install` 実行
- [x] `vite.config.ts` を更新（vue + @tailwindcss/vite プラグイン追加）
- [x] `config/vite.json` の `sourceCodeDir` を `app/frontend` に変更、`host: "0.0.0.0"` を追加（Docker HMR 対応）
- [x] `tsconfig.json` を作成
- [x] `biome.json` を作成（Biome v2 形式）
- [x] `app/frontend/style.css` を作成（`@import "tailwindcss"` + `@source "../views/**/*.erb"`）
- [x] `app/frontend/entrypoints/application.js` を作成（style.css を import）
- [x] `app/views/layouts/application.html.erb` に `vite_client_tag` / `vite_javascript_tag` を追加、`tailwind` stylesheet タグを削除
- [x] `docker-compose.yml` を更新（`bin/vite dev` 起動、ポート 3036 公開）
- [x] `.github/workflows/ci.yml` に Node.js セットアップ、`npm ci`、`vite build`、`biome check` を追加
- [x] `tailwindcss-rails` gem を Gemfile から削除
- [x] 動作確認：スタイル適用済み・HMR 動作・CI グリーン

> **学び:**
> - Tailwind v4 は `tailwind.config.js` 不要。`@source` ディレクティブで ERB ファイルを指定する
> - Docker 内 Vite HMR は `config/vite.json` に `"host": "0.0.0.0"` が必要

## Phase 2: API レイヤー構築 ✅

- [x] `app/controllers/api/v1/base_controller.rb` を作成
- [x] `app/controllers/api/v1/items_controller.rb` を作成（index, show, create, update, destroy + タグフィルタ）
- [x] `app/controllers/api/v1/tags_controller.rb` を作成（index）
- [x] `config/routes.rb` に API namespace を追加
- [x] `spec/requests/api/v1/items_spec.rb` を作成
- [x] `spec/requests/api/v1/tags_spec.rb` を作成
- [x] 動作確認：RSpec 全パス

> **学び:**
> - シリアライザー gem は不要。コントローラー内の `item_json` ヘルパーで十分
- [ ] `spec/requests/api/v1/items_spec.rb` を作成
- [ ] `spec/requests/api/v1/tags_spec.rb` を作成
- [ ] 動作確認：RSpec request spec 全パス

## Phase 3: Vue アプリシェル + ルーター

- [ ] `app/frontend/App.vue` を作成（router-view + ヘッダー）
- [ ] `app/frontend/router/index.ts` を作成（`/vue/items` 系ルート）
- [ ] `app/frontend/api/client.ts` を作成（CSRF 対応 fetch wrapper）
- [ ] `app/frontend/api/items.ts` を作成（getItems, getItem, createItem, updateItem, deleteItem）
- [ ] `app/frontend/api/tags.ts` を作成（getTags）
- [ ] `app/frontend/components/common/AppHeader.vue` を作成
- [ ] `app/frontend/components/common/FlashMessage.vue` を作成
- [ ] `app/controllers/vue_controller.rb` を作成
- [ ] `app/views/vue/index.html.erb` を作成（`<div id="app">` のみ）
- [ ] `config/routes.rb` に `get "/vue/*path", to: "vue#index"` を追加
- [ ] `app/frontend/entrypoints/application.ts` を更新（Vue マウント）
- [ ] 動作確認：`/vue/items` で Vue シェルが表示される

## Phase 4: ビュー移行（段階的）

移行順序は単純なものから：

### 4a: Item 詳細ページ
- [ ] `app/frontend/components/items/ItemShow.vue` を作成
- [ ] `app/frontend/composables/useItems.ts` を作成
- [ ] `app/frontend/components/items/__tests__/ItemShow.spec.ts` を作成

### 4b: Item 一覧ページ
- [ ] `app/frontend/components/items/ItemList.vue` を作成
- [ ] `app/frontend/components/items/ItemCard.vue` を作成
- [ ] `app/frontend/components/items/TagFilter.vue` を作成
- [ ] `app/frontend/composables/useTags.ts` を作成
- [ ] `app/frontend/components/items/__tests__/ItemList.spec.ts` を作成
- [ ] `app/frontend/components/items/__tests__/TagFilter.spec.ts` を作成

### 4c: Item 作成ページ
- [ ] `app/frontend/components/items/ItemForm.vue` を作成（create モード）
- [ ] `app/frontend/components/items/__tests__/ItemForm.spec.ts` を作成

### 4d: Item 編集ページ
- [ ] `ItemForm.vue` を edit モード対応に拡張（既存データ読込 + 更新）

### 4e: 削除機能
- [ ] `ItemShow.vue` に確認ダイアログ付き削除ボタンを追加

### CI 更新
- [ ] `.github/workflows/ci.yml` に `vitest run` ステップを追加
- [ ] 動作確認：`/vue/items/*` で全 CRUD 操作が動作 + Vitest 全パス

## Phase 5: ルート切替 + クリーンアップ

- [ ] `config/routes.rb` を更新：`/items/*` を Vue controller に向ける
- [ ] `app/frontend/router/index.ts` から `/vue` プレフィックスを削除
- [ ] ERB ビュー削除：`app/views/items/` 全6ファイル
- [ ] `app/controllers/items_controller.rb` を削除
- [ ] Stimulus 関連ファイル削除：`app/javascript/` 配下全ファイル
- [ ] `config/importmap.rb` を削除
- [ ] Gemfile から不要 gem 削除：`importmap-rails`, `turbo-rails`, `stimulus-rails`, `tailwindcss-rails`
- [ ] `app/views/layouts/application.html.erb` から Importmap タグ・旧 Tailwind タグ削除
- [ ] `bundle install` 実行
- [ ] 動作確認：`/items/*` が Vue SPA として動作

## Phase 6: E2E テスト + CI 最終化

- [ ] `playwright.config.ts` を作成
- [ ] `e2e/items.spec.ts` を作成（CRUD フロー）
- [ ] `e2e/tag-filter.spec.ts` を作成（タグフィルタリング）
- [ ] `.github/workflows/ci.yml` に Playwright ステップを追加
- [ ] 動作確認：CI 全ステップ green

### CI 最終パイプライン

```
Ruby setup → Node setup → npm ci → db:migrate → vite build
→ biome check → vitest run → rspec → playwright install → playwright test
```
