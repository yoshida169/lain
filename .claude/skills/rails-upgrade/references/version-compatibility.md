# Rails / Ruby バージョン互換性リファレンス

## バージョン互換性マトリクス

| Rails | 必須 Ruby | 推奨 Ruby | EOL |
|-------|-----------|-----------|-----|
| 7.0.x | >= 2.7.0 | 3.2+ | 2025-04-01 |
| 7.1.x | >= 2.7.0 | 3.2+ | 2025-10-01 |
| 7.2.x | >= 3.1.0 | 3.3+ | 2026-08-09 |
| 8.0.x | >= 3.2.0 | 3.3+ | - |

## Rails 7.0 → 7.1 の主要変更

### 破壊的変更
- `ActiveRecord::Base.connection` が非推奨、`with_connection` や `lease_connection` を推奨
- `Rails.application.credentials` のデフォルト暗号化方式変更
- `config.active_record.default_column_serializer` が `nil` に変更（YAML の自動シリアライズが無効に）
- `config.active_support.cache_format_version` が `7.1` に変更
- Zeitwerk の autoload パスから `lib/` がデフォルト追加

### 新機能
- `normalizes` メソッド（ActiveRecord の属性正規化）
- `generates_token_for` メソッド
- `authenticate_by` メソッド
- Trilogy MySQL アダプタ対応
- 非同期クエリの改善
- `Dockerfile` の自動生成

### 注目の framework defaults（`new_framework_defaults_7_1.rb`）
- `config.active_record.default_column_serializer = nil`
- `config.active_support.cache_format_version = 7.1`
- `config.active_record.run_commit_callbacks_on_first_saved_instances_in_transaction = false`
- `config.active_record.sqlite3_adapter_strict_strings_mode = true`
- `config.action_dispatch.default_headers` からの `X-Download-Options` と `X-Permitted-Cross-Domain-Policies` 削除

## Rails 7.1 → 7.2 の主要変更

### 破壊的変更
- **Ruby 3.1 以上が必須**
- `config.active_record.automatically_invert_plural_associations` の導入
- `config.active_support.to_time_preserves_timezone` が `:zone` に変更
- `before_action` フィルタのみの route helper 廃止

### 新機能
- Development container 設定（devcontainer）の自動生成
- ブラウザバージョンガード（`allow_browser`）
- Progressive Web App（PWA）デフォルトファイル
- `bin/rails boot` コマンド
- YJIT デフォルト有効化

### 注目の framework defaults（`new_framework_defaults_7_2.rb`）
- `config.active_record.automatically_invert_plural_associations = true`
- `config.active_support.to_time_preserves_timezone = :zone`
- `config.active_record.validate_migration_timestamps = true`
- `config.active_job.enqueue_after_transaction_commit = :default`

## Rails 7.2 → 8.0 の主要変更

### 破壊的変更
- **Ruby 3.2 以上が必須**
- `sprockets-rails` がデフォルトから除外（Propshaft に移行推奨）
- `config.load_defaults 8.0` で多数のデフォルト変更
- `Rails.application.secrets` の削除（`credentials` を使用）
- `ActionController::Live#send_stream` の変更

### 新機能
- Kamal 2 によるデプロイ設定
- Thruster リバースプロキシ
- Solid Cable（WebSocket アダプタ）
- Solid Cache（DB ベースのキャッシュ）
- Solid Queue（DB ベースのジョブキュー）
- `params.expect` メソッド（Strong Parameters の強化）
- `script/` フォルダ
- Propshaft がデフォルトのアセットパイプライン
- 認証ジェネレータ（`bin/rails generate authentication`）

### 注目の framework defaults（`new_framework_defaults_8_0.rb`）
- `config.action_dispatch.strict_freshness = true`
- `config.active_record.permanent_connection_checkout = :disallowed`

## 参照リンク

- [Rails アップグレードガイド](https://railsguides.jp/upgrading_ruby_on_rails.html)
- [Rails 7.1 リリースノート](https://railsguides.jp/7_1_release_notes.html)
- [Rails 7.2 リリースノート](https://railsguides.jp/7_2_release_notes.html)
- [Rails 8.0 リリースノート](https://railsguides.jp/8_0_release_notes.html)
- [Ruby on Rails セキュリティポリシー](https://rubyonrails.org/security)
