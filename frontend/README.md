# くらしログ フロントエンド

天気予報・カレンダー・家計簿を1つにまとめる個人利用PWA。React + TypeScript + Vite + Tailwind CSSで実装。

## セットアップ

依存関係のインストールはプロジェクトルートでworkspace単位に行う想定です(このディレクトリでは`npm install`を実行していません)。

```bash
# リポジトリルートで
npm install

# 開発サーバー起動(frontendのみ)
npm run dev --workspace frontend
```

環境変数ファイルを用意してください。

```bash
cp frontend/.env.example frontend/.env.local
```

| 変数名 | 説明 |
|---|---|
| `VITE_API_BASE_URL` | バックエンド(Cloudflare Workers)APIのベースURL。未設定・未接続時は各画面がモックデータにフォールバックし、空画面にはなりません。 |

## スクリプト

- `npm run dev` — 開発サーバー起動
- `npm run build` — 型チェック + 本番ビルド
- `npm run preview` — ビルド成果物のプレビュー
- `npm run lint` — ESLint実行

## 認証について

認証はCloudflare Accessがエッジ側で担うため、フロントエンドにログイン画面やトークン管理は実装していません。API呼び出しは`credentials: 'include'`でCookieを送信します。

## ディレクトリ構成

```
src/
  app/            ルーティング・レイアウト・Provider・ナビゲーション定義
  components/ui/  共通UIコンポーネント(Radix UI + Tailwind)
  features/       画面ごとの実装(api/hooks/components)
  lib/            fetchラッパー、日付ユーティリティ、Push通知ヘルパー
  stores/         Zustandグローバル状態(テーマ・選択地域・通知プライミング)
  styles/         Tailwind + CSSカスタムプロパティ(デザイントークン)
```

## モックデータについて

バックエンドAPIがまだ稼働していない前提で、各featureの`api/`配下に`mockData.ts`を用意しています。実APIへのfetchが失敗した場合(未接続・エラー)は自動的にモックへフォールバックし、画面が空にならないようにしています。カレンダー・家計簿の作成/更新/削除はモック内のインメモリ配列を直接書き換えるため、実際に画面上で追加・編集・削除の挙動を確認できます(リロードで初期状態に戻ります)。

## PWA

`vite-plugin-pwa`でService Workerとマニフェストを生成します。アプリシェルはStaleWhileRevalidate、天気APIはNetworkFirstでキャッシュします。アイコンは`public/icon-192.svg` / `public/icon-512.svg`のプレースホルダーです。
