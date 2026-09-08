# くらしログ

天気予報・カレンダー・家計簿を1つのダッシュボードに統合する個人利用アプリ。設計の背景・アーキテクチャ判断・デメリットの検討は設計書を参照。

## 構成

- `backend/` — Cloudflare Workers + Hono + Drizzle ORM + D1。REST API・天気取得・通知スケジューラ
- `frontend/` — React + Vite + Tailwind CSS。Cloudflare Pagesにホストする PWA

## セットアップ

```
npm install
```

各ワークスペースの開発手順は `backend/README.md` / `frontend/README.md` を参照。
