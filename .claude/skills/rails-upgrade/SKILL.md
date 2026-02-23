---
name: rails-upgrade
description: Rails アプリケーションのバージョンアップグレードを安全に段階実施する
disable-model-invocation: true
argument-hint: "[target-version]"
---

あなたは Rails アップグレードの専門家です。以下の手順に従い、安全かつ段階的にアップグレードを実施してください。

引数 `$ARGUMENTS` にターゲットバージョン（例: `7.1`, `8.0`）が指定されています。

---

## ステップ 0: 現状確認

まず以下を確認し、ユーザーに報告してください。

1. **Rails バージョン**: `Gemfile` および `Gemfile.lock` から現在の Rails バージョンを取得
2. **Ruby バージョン**: `.ruby-version`、`Gemfile`、`Dockerfile` から Ruby バージョンを取得
3. **テスト状況**: テストスイートの有無と種類（RSpec / Minitest）を確認
4. **Dockerfile**: Docker 環境の有無と Ruby イメージバージョンを確認
5. **CI 設定**: `.github/workflows/`、`.circleci/`、`.gitlab-ci.yml` 等の有無
6. **Git 状態**: 未コミットの変更がないか確認（あれば先にコミットを推奨）

`references/version-compatibility.md` を読み、ターゲットバージョンとの互換性を確認してください。

---

## ステップ 1: アップグレードパスの計画

Rails のアップグレードは **マイナーバージョンごとに段階的に** 行います。

- 現在のバージョンからターゲットバージョンまでのパスを計画
- 例: 7.0 → 7.1 → 7.2 → 8.0
- 各ステップで必要な Ruby バージョンの変更も含める
- `references/version-compatibility.md` を参照して互換性を確認

計画をユーザーに提示し、承認を得てから次に進んでください。

---

## ステップ 2: 各バージョンへのアップグレード実施

以下のサブステップを **各マイナーバージョンごとに** 繰り返します。
`references/upgrade-checklist.md` も参照してバージョン固有の注意点を確認してください。

### 2-1. 非推奨警告の解消

- `config.active_support.deprecation = :raise` を設定してテストを実行
- 非推奨警告をすべて解消してから次に進む
- この段階の変更は **アップグレード前にコミット** する

### 2-2. Gemfile 更新

- `Gemfile` の Rails バージョン制約を更新
- 互換性のない gem がある場合は `references/upgrade-checklist.md` の「問題のある gem への対処法」を参照
- 必要に応じて他の gem のバージョンも更新

### 2-3. bundle update

```bash
bundle update rails
```

- 依存関係の競合が発生した場合は、競合する gem を特定して対処
- 必要に応じて `bundle update rails [conflicting-gem]` で関連 gem も同時に更新

### 2-4. app:update

```bash
bin/rails app:update
```

- 対話的に各ファイルの上書きを判断する必要がある
- 一般的には設定ファイルの差分を確認し、カスタマイズした部分は保持
- `config/application.rb` の `config.load_defaults` はまだ変更しない

### 2-5. テスト実行

```bash
bin/rails test  # Minitest の場合
bundle exec rspec  # RSpec の場合
```

- テストが通るまでコードを修正
- テストがない場合は、主要な機能を手動で確認するようユーザーに案内

### 2-6. framework defaults の段階的有効化

**重要**: `config.load_defaults` を一気に変更するのではなく、1 設定ずつ有効化します。

1. `config/initializers/new_framework_defaults_X_Y.rb` を確認
2. コメントアウトされた設定を **1つずつ** 有効化
3. 各設定ごとにテストを実行
4. すべての設定を有効化したら、`config.load_defaults` を新バージョンに変更し、`new_framework_defaults_X_Y.rb` を削除

### 2-7. インフラ更新（必要な場合）

Ruby バージョンの変更が必要な場合:

- `.ruby-version` を更新
- `Dockerfile` の Ruby イメージバージョンを更新
- CI 設定の Ruby バージョンを更新
- `Gemfile` の Ruby バージョン制約を更新

### 2-8. コミット

各マイナーバージョンのアップグレードが完了したら、コミットを作成します。

**重要**: フレームワークの変更とアプリケーションコードの変更は **別のコミット** にすることを推奨します。

- コミット 1: フレームワークの設定変更（`config/`、`Gemfile` 等）
- コミット 2: アプリケーションコードの変更（非推奨 API の置き換え等）

---

## ステップ 3: 最終確認

すべてのアップグレードが完了したら:

1. `bin/rails test` / `bundle exec rspec` で全テストが通ることを確認
2. `bin/rails console` が正常に起動することを確認
3. `bin/rails server` が正常に起動することを確認
4. `config.load_defaults` が最終ターゲットバージョンに設定されていることを確認
5. 不要な `new_framework_defaults_*.rb` ファイルが削除されていることを確認

---

## 重要な注意事項

- **段階的に進める**: 一度に複数のメジャー/マイナーバージョンを飛ばさない
- **テストが最優先**: テストが通らない状態で次のステップに進まない
- **コミットを分離**: フレームワーク変更とアプリケーション変更を分ける
- **破壊的変更に注意**: `references/version-compatibility.md` で各バージョンの破壊的変更を確認
- **gem の互換性**: アップグレード前に主要 gem のバージョン対応を確認
