# splatoon-random-weapon

スプラトゥーンでバトルをする時にチームの使う武器をランダムで決めるアプリ

※このリポジトリでは試験的に​Coderabbit​を活用してAIによるコードレビューを行っています。

## 開発環境

Node.js は `mise` で管理し、`20.x` を使用します。

```bash
mise install
mise use
```

## バックエンド 
- Hono 
- Cloudflare Workers / Wrangler CLI
- Cloudflare D1（武器一覧と結果履歴）

## フロントエンド/UI 
- ​Preact​ 
- ​SWR​ 
- ​TailwindCSS​ 

## 開発ツール 
- Vite​ 
- ​ESLint & StyleLint 
- ​Prettier 
- ​Husky
- lint-staged
