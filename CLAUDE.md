# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 技術スタック

- **Ruby** 3.2.5 / **Rails** 7.2
- **DB**: PostgreSQL 16（Docker コンテナで起動）
- **フロントエンド**: Hotwire (Turbo + Stimulus) + Importmap（webpackやesbuildは不使用）
- **テスト**: Minitest（Rails標準）+ Capybara + Selenium（システムテスト）
- **タグ実装**: `acts-as-taggable-on` 不使用。Tag / ItemTag モデルをゼロから実装

## 開発環境の起動

Docker Compose で DB と Rails サーバーを一括起動する。

```bash
# 初回セットアップ
docker compose build
docker compose run --rm web bin/rails db:create db:migrate

# サーバー起動
docker compose up

# コンテナ内でコマンド実行
docker compose run --rm web bin/rails console
docker compose run --rm web bin/rails db:migrate
docker compose run --rm web bin/rails test
```

DB 接続情報（`docker-compose.yml` の環境変数で設定）:
- Host: `db`（コンテナ間通信）
- User: `user` / Password: `password` / DB: `lain_development`

## よく使うコマンド

```bash
# テスト全実行
docker compose run --rm web bin/rails test

# 単一テストファイル実行
docker compose run --rm web bin/rails test test/models/item_test.rb

# システムテスト
docker compose run --rm web bin/rails test:system
```

## アーキテクチャ概要

### アプリコンセプト

**lain** — セカンドブレイン（思考の外部化と再発見）。Item を記録・タグで分類・検索するノートアプリ。

### データモデル

```
items       : title(string), content(text)
tags        : name(string, UNIQUE NOT NULL)
item_tags   : item_id(FK), tag_id(FK)  ← 中間テーブル、(item_id, tag_id) にユニーク制約
```

### タグ機能の実装パターン

- `Item#tag_names=` でカンマ区切り文字列をパースし `Tag.find_or_create_by!` で一括登録
- `Item#tag_names` でタグ名をカンマ区切りで返す
- フォームは `:tag_names` をストロングパラメータに含める（`tag_ids` は不使用）
- `ItemsController#index` は `params[:tag]` で OR フィルタリング（`WHERE tags.name IN (...)` + `DISTINCT`）

### 今後の予定機能（マイルストーン1後半）

デイリーノート機能: `items` テーブルに `item_type`（"note" or "daily"）と `note_date`（date）カラムを追加する方針（別テーブル化しない）。詳細は `docs/milestone1_requirements.md` 参照。
