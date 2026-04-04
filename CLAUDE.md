# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

**lain** — セカンドブレイン（思考の外部化と再発見）。Item を記録・タグで分類・検索するノートアプリ。

## 技術スタック

- **Ruby** 3.2.5 / **Rails** 7.2
- **DB**: PostgreSQL 16（Docker コンテナで起動）
- **フロントエンド**: Hotwire (Turbo + Stimulus) + Importmap（webpackやesbuildは不使用）
- **テスト**: RSpec + FactoryBot（`spec/` 配下）

## 開発環境の起動

Docker Compose で DB と Rails サーバーを一括起動する。

```bash
# 初回セットアップ
docker compose build
docker compose run --rm app bin/rails db:create db:migrate

# サーバー起動
docker compose up

# コンテナ内でコマンド実行
docker compose run --rm app bin/rails console
docker compose run --rm app bin/rails db:migrate
docker compose run --rm app bin/rails test
```

DB 接続情報（`docker-compose.yml` の環境変数で設定）:

- Host: `db`（コンテナ間通信）
- User: `user` / Password: `password` / DB: `lain_development`

## よく使うコマンド

```bash
# テスト全実行
docker compose run --rm app bundle exec rspec

# 単一テストファイル実行
docker compose run --rm app bundle exec rspec spec/models/item_spec.rb

# 特定の行のみ実行
docker compose run --rm app bundle exec rspec spec/models/item_spec.rb:10
```
