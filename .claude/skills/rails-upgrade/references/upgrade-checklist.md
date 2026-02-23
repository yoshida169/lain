# Rails アップグレード詳細チェックリスト

## 共通チェックリスト（全バージョン共通）

### アップグレード前
- [ ] すべてのテストが通っている
- [ ] 未コミットの変更がない（`git status` で確認）
- [ ] `Gemfile.lock` をコミット済み
- [ ] 主要 gem のバージョン対応を確認（後述の「問題のある gem」参照）
- [ ] 非推奨警告を解消済み（`config.active_support.deprecation = :raise` でテスト実行）

### アップグレード実施
- [ ] `Gemfile` のバージョン制約を更新
- [ ] `bundle update rails` を実行
- [ ] `bin/rails app:update` を実行し、設定ファイルを更新
- [ ] `config.load_defaults` はまだ変更しない
- [ ] テストが通ることを確認

### framework defaults の有効化
- [ ] `config/initializers/new_framework_defaults_X_Y.rb` の内容を把握
- [ ] 設定を 1 つずつ有効化し、都度テストを実行
- [ ] 全設定を有効化後、`config.load_defaults X.Y` に変更
- [ ] `new_framework_defaults_X_Y.rb` を削除
- [ ] テストが通ることを確認

### インフラ更新（Ruby バージョン変更が必要な場合）
- [ ] `.ruby-version` を更新
- [ ] `Dockerfile` の Ruby イメージバージョンを更新（例: `ruby:3.3-alpine`）
- [ ] `Gemfile` の Ruby バージョン制約を更新
- [ ] CI 設定の Ruby バージョンを更新
- [ ] `bundle install` が通ることを確認

### コミット
- [ ] フレームワーク設定変更を別コミット
- [ ] アプリケーションコード変更を別コミット

---

## 問題のある gem への対処法

### メンテナンス切れ・互換性問題のある gem

| gem | 問題 | 対処法 |
|-----|------|--------|
| `rails_admin` | Rails 7.1+ で問題が多い | `administrate` や `avo` への移行を検討 |
| `paperclip` | メンテナンス切れ | `active_storage` または `carrierwave` に移行 |
| `responders` | バージョン依存が強い | `~> 3.1` 以上に更新 |
| `cancancan` | Rails 7+ でバージョン固定が必要 | `>= 3.4` に更新 |
| `acts_as_paranoid` | ActiveRecord の変更に追従が遅い | fork 版や `paranoia` を検討 |
| `money-rails` | Rails 7.1+ で設定変更が必要 | `>= 1.15` に更新 |
| `activerecord-import` | バージョン対応が必要 | `>= 1.5` に更新 |
| `delayed_job` | Active Job に移行推奨 | Rails 8 では `solid_queue` を検討 |
| `whenever` | Cron 管理 gem、互換性注意 | バージョンを `~> 1.0` に更新 |
| `sprockets` | Rails 8 でデフォルト外 | `propshaft` への移行を検討 |

### モンキーパッチ系 gem の注意点

Rails 内部 API に依存した gem は、アップグレードで壊れやすい。

- `config/initializers/` で `alias_method_chain` を使っているコードを確認
- `ActiveRecord::Base` を直接 open している gem を確認
- `ActionController::Base` を直接 open している gem を確認

対処法:
1. `bundle exec rake notes` で TODO/FIXME/HACK コメントを確認
2. gem のリポジトリで Rails バージョン対応状況を確認
3. 必要に応じて fork して自前でパッチ

---

## バージョン固有チェックリスト

### 7.0 → 7.1

#### ActiveRecord
- [ ] `ActiveRecord::Base.connection` の使用箇所を `with_connection` に移行検討
- [ ] YAML シリアライズ依存の列がないか確認（`default_column_serializer = nil` の影響）
  - `serialize :column_name` を使っているモデルを確認
  - `attribute :name, :json` への移行を検討
- [ ] `has_one` / `has_many` の `through` 関連の動作変更を確認

#### ActiveSupport
- [ ] キャッシュを使っている場合、`cache_format_version` 変更の影響確認
  - キャッシュを一度クリアする必要がある場合あり
- [ ] `Time.current` の動作変更がないか確認

#### ActionDispatch
- [ ] セキュリティヘッダー削除の影響確認
  - `X-Download-Options` を明示的に設定している場合は維持
  - `X-Permitted-Cross-Domain-Policies` も同様

#### Credentials
- [ ] `config/credentials.yml.enc` の暗号化形式の移行
  - `bin/rails credentials:edit` で内容を確認・保存し直す

### 7.1 → 7.2

#### Ruby バージョン
- [ ] Ruby 3.1 以上に更新（必須）
- [ ] Ruby 3.1/3.2 での動作確認

#### ActiveRecord
- [ ] `automatically_invert_plural_associations = true` の影響確認
  - `has_many :through` で双方向関連が自動検出されるように
  - 既存の `inverse_of:` 指定が不要になる場合あり（重複指定は問題なし）
- [ ] マイグレーションのタイムスタンプ検証が厳格化
  - 古い命名規則のマイグレーションがある場合は確認

#### ActiveJob
- [ ] `enqueue_after_transaction_commit = :default` の影響確認
  - トランザクション内でのジョブエンキューの動作が変わる可能性

#### ActiveSupport
- [ ] `to_time_preserves_timezone = :zone` の影響確認
  - `Time` オブジェクトのタイムゾーン変換の動作変更

### 7.2 → 8.0

#### Ruby バージョン
- [ ] Ruby 3.2 以上に更新（必須）
- [ ] Ruby 3.2/3.3 での動作確認

#### アセットパイプライン
- [ ] `sprockets-rails` を使っている場合、`propshaft` への移行検討
  - または `sprockets-rails` を Gemfile で明示的に指定して継続使用
- [ ] JavaScript の管理方法確認（importmap / esbuild / vite）

#### Secrets の削除
- [ ] `Rails.application.secrets` の使用箇所を `Rails.application.credentials` に移行
- [ ] `config/secrets.yml` を使っている場合は `credentials` に移行

#### ActionDispatch
- [ ] `strict_freshness = true` の影響確認
  - HTTP キャッシュ（ETag/Last-Modified）の動作が厳格化

#### ActiveRecord
- [ ] `permanent_connection_checkout = :disallowed` の影響確認
  - `ActiveRecord::Base.connection` を長期保持するコードがある場合

#### Strong Parameters
- [ ] `params.require(:model).permit(...)` を `params.expect(model: [...])` への移行検討（任意）

---

## トラブルシューティング

### `bundle update rails` で依存関係の競合が発生

```bash
# 競合している gem を特定
bundle update rails --verbose

# 特定の gem と一緒に更新
bundle update rails nokogiri

# gem のバージョン制約を一時的に緩める
# Gemfile で "~> x.y" を ">= x.y" に変更して試す
```

### テストで `DeprecationWarning` が大量に出る

```ruby
# config/environments/test.rb に追加
config.active_support.deprecation = :raise
```

テスト実行後、ひとつずつ修正する。

### `bin/rails app:update` でコンフリクト

差分を確認して手動でマージ:

```bash
# バックアップを作成してから実行
cp config/application.rb config/application.rb.bak
bin/rails app:update
```

重要な設定（カスタマイズ済みの箇所）は元のファイルから戻す。

### Ruby バージョン変更後に native extension がビルドできない

```bash
# gem の native extension を再ビルド
bundle exec gem pristine --all

# または問題の gem だけ
bundle exec gem pristine nokogiri
```

### Docker 環境でのアップグレード

```dockerfile
# Dockerfile の Ruby バージョン変更例
FROM ruby:3.3-alpine  # 変更前の行を更新

# bundle install のキャッシュが効かなくなる場合は
# --no-cache でビルド
docker compose build --no-cache
```
