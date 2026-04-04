# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

**lain** — セカンドブレイン（思考の外部化と再発見）。Item を記録・タグで分類・検索するノートアプリ。

## 技術スタック

- **Ruby** 3.2.5 / **Rails** 7.2
- **DB**: PostgreSQL 16（Docker コンテナで起動）
- **フロントエンド**: Vue.js 3 + Vue Router + TypeScript + Tailwind CSS v4
- **ビルド**: Vite（vite-plugin-ruby 経由、dev port 3036）
- **テスト**: RSpec + FactoryBot（バックエンド）、Vitest（フロントエンド）、Playwright（E2E）
- **Lint**: Biome（対象: `app/frontend/**/*`, `e2e/**/*`、.vue ファイルは除外）

## アーキテクチャ

Rails JSON API + Vue.js SPA の構成。

- **API**: `Api::V1` 名前空間で RESTful JSON API を提供（CSRF スキップ）
  - `Api::V1::BaseController` — 共通エラーハンドリング
  - `Api::V1::ItemsController` — CRUD + タグフィルタリング（`?tag[]=ruby&tag[]=rails`）
  - `Api::V1::TagsController` — 一覧のみ
- **SPA マウント**: `VueController#index` が全フロントエンドルートを受ける（`/items`, `/items/*`）
- **フロントエンド** (`app/frontend/`):
  - `entrypoints/application.ts` — Vue アプリのエントリポイント
  - `router/index.ts` — ルート定義（遅延読み込み）
  - `api/` — API クライアント層（CSRF トークン自動注入）
  - `composables/` — `useItems`, `useTags`（Pinia/Vuex 不使用、composable で状態管理）
  - `pages/` — ItemIndex, ItemNew, ItemShow, ItemEdit
  - `components/items/` — ItemForm, ItemCard, TagFilter
  - `components/common/` — AppHeader, FlashMessage

## 開発環境の起動

Docker Compose で DB + Rails + Vite dev server を一括起動する。

```bash
# 初回セットアップ
docker compose build
docker compose run --rm app bin/rails db:create db:migrate

# サーバー起動（Rails: 3000, Vite: 3036）
docker compose up

# コンテナ内でコマンド実行
docker compose run --rm app bin/rails console
docker compose run --rm app bin/rails db:migrate
```

DB 接続情報（`docker-compose.yml` の環境変数で設定）:

- Host: `db`（コンテナ間通信）
- User: `user` / Password: `password` / DB: `lain_development`

## よく使うコマンド

```bash
# バックエンドテスト（RSpec）
docker compose run --rm app bundle exec rspec
docker compose run --rm app bundle exec rspec spec/models/item_spec.rb
docker compose run --rm app bundle exec rspec spec/models/item_spec.rb:10

# フロントエンドテスト（Vitest）
npm run test
npm run test:watch

# E2Eテスト（Playwright — ローカルで実行、localhost:3000 が必要）
npm run e2e

# lint（Biome）
docker compose run --rm app npx biome check
```
