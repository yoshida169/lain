# Vue.js 移行チェックリスト

Hotwire (Turbo + Stimulus) + Importmap から Vue.js + Vite へ段階的に移行するためのチェックリスト。

## Phase 1: 基盤構築（Node.js + Vite + ツールチェーン）

ユーザー影響なし。ビルド基盤のみ整備する。

- [ ] Dockerfile に Node.js 20 を追加
- [ ] `package.json` を作成（vue, vite, @vitejs/plugin-vue, typescript, tailwindcss, postcss, autoprefixer, biome, vitest, playwright）
- [ ] `vite_rails` gem を Gemfile に追加
- [ ] `bundle install` + `npm install` 実行
- [ ] `vite.config.ts` を作成
- [ ] `tsconfig.json` を作成
- [ ] `biome.json` を作成
- [ ] `postcss.config.js` を作成
- [ ] `tailwind.config.js` を作成（content に `app/views/**/*.erb` と `app/frontend/**/*.vue` を指定）
- [ ] `app/frontend/entrypoints/application.ts` を作成（最小限の確認用コード）
- [ ] `app/frontend/style.css` を作成（Tailwind ディレクティブ）
- [ ] `app/views/layouts/application.html.erb` に `vite_javascript_tag` / `vite_stylesheet_tag` を追加
- [ ] `docker-compose.yml` を更新（Vite dev server 起動を追加）
- [ ] `.github/workflows/ci.yml` に Node.js セットアップ、`npm ci`、`vite build`、`biome check` を追加
- [ ] `.gitignore` に Node.js 関連エントリを追加
- [ ] 動作確認：アプリが従来通り動作 + ブラウザコンソールに Vite 出力
- [ ] `tailwindcss-rails` gem を Gemfile から削除（Vite 経由の Tailwind が動作確認できた後）

## Phase 2: API レイヤー構築

- [ ] `app/controllers/api/v1/base_controller.rb` を作成
- [ ] `app/controllers/api/v1/items_controller.rb` を作成（index, show, create, update, destroy + タグフィルタ）
- [ ] `app/controllers/api/v1/tags_controller.rb` を作成（index）
- [ ] `app/serializers/item_serializer.rb` を作成（id, title, content, tags, created_at, updated_at）
- [ ] `app/serializers/tag_serializer.rb` を作成（id, name, items_count）
- [ ] `config/routes.rb` に API namespace を追加
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
