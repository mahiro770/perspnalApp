# kurashi-log-backend

Cloudflare Workers + Hono + Drizzle ORM + D1 で構成するAPIワークスペース。このドキュメントはDB層(Drizzle + D1)のセットアップ手順のみを扱う。

## 初回セットアップ

1. 依存関係のインストール(リポジトリルートで実行)

   ```
   npm install
   ```

2. D1データベースの作成

   ```
   npx wrangler d1 create kurashi-log-db
   ```

   出力される `database_id` を `backend/wrangler.toml` の `[[d1_databases]]` セクションにある `database_id = "PLACEHOLDER_RUN_WRANGLER_D1_CREATE"` と置き換える。

## スキーマ変更のたびに行うこと

1. `src/db/schema.ts` を編集する。
2. マイグレーションファイルを生成する。

   ```
   npm run db:generate
   ```

   `drizzle/` 配下にSQLマイグレーションが出力される。

3. ローカルD1(`.wrangler/state` 配下のシミュレータ)に適用する。

   ```
   npm run db:migrate:local
   ```

4. 動作確認後、本番D1に適用する。

   ```
   npm run db:migrate:remote
   ```

## テーブルを追加する場合の方針

既存テーブルの列を後から壊す変更(型変更・削除)は避け、新規テーブルを追加する形で拡張する。他テーブルと紐付けたい場合は `calendar_events` の例にならい、nullableな外部キー列(`xxx_id`, `onDelete: 'set null'`)を追加する設計とする。

## API層(Hono + Workers)

`src/` はエントリポイント(`index.ts`)、Honoアプリ組み立て(`app.ts`)、共通処理(`core/`)、機能別モジュール(`modules/weather|calendar|budget|notification`)で構成する。各モジュールは `routes.ts → service.ts → repository.ts` の一方向依存。Drizzle Clientを直接触るのは `repository.ts` のみ。

### 環境変数 / シークレット

`wrangler.toml` の `[vars]` に `ALLOWED_ORIGIN`(CORS許可オリジン)を平文で置いている。以下はシークレットのためtomlに書かず `wrangler secret put <NAME>` で設定する:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`(例: `mailto:you@example.com`)

VAPID鍵ペアは実行時ではなく事前生成でよいので、一時的に `npx web-push generate-vapid-keys` を実行して得た鍵を登録する(このコマンドはローカルのNode環境で完結し、`web-push` はランタイム依存として追加していない)。

### Web Push実装の選定

`web-push`(npm)はNode組み込みの `crypto` モジュールに依存する実装が多く、Cloudflare Workersのランタイムでは動作しない。そのため、Web Crypto APIのみで実装されている **`@block65/webcrypto-web-push`** を採用した(`src/core/push.ts`)。

- VAPID署名(ECDSA)とpush用ペイロード暗号化(aes128gcm)をWeb Crypto APIだけで行うため、Workers/Deno/ブラウザ環境で動作する。
- `buildPushPayload()` は実際のfetchを内部で行わず、`fetch(endpoint, init)` にそのまま渡せる `RequestInit` を返すだけの設計。そのため送信結果のステータスコードをこちら側で判定でき、`404`/`410`(エンドポイント失効)時に該当 `push_subscriptions` を無効化する処理を`notification/service.ts`側に実装している。
- 制約: `npm install` 未実施のため、実際のexport名・型シグネチャ(`buildPushPayload`, `PushMessage`, `PushSubscription`, `VapidDetails` 等)はこちらの記憶ベースの実装であり、インストール後に型エラーが出た場合は同パッケージの型定義に合わせて `src/core/push.ts` を微調整する必要がある。

## 未検証事項

以下は環境上 `npm install` / `wrangler dev` / 実D1接続を実行できていないため未検証:

- `drizzle-orm` の D1ドライバでの `.returning()` の実際の挙動
- `@block65/webcrypto-web-push` の実際のAPIシグネチャとの整合性
- Hono `cors()` の `origin` 関数オプションの型・動作(バージョン `^4.6.0` を想定)
- JMA地域コード(`src/modules/weather/regionCodes.ts`)の正確性(代表的な都道府県コードのみ記憶ベースで同梱。他地域を追加する際はJMAの `https://www.jma.go.jp/bosai/common/const/area.json` で正式なコードを確認すること)
- Cron Trigger(`*/30 * * * *`, `0 22 * * *`)の実発火・`event.cron`分岐ロジック
