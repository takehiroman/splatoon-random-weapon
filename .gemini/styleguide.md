まずレビューについては全て日本語で返答してください。以下はこのプロジェクトのコーディング規約となります
# Preact + TypeScript + Vite 5 + Hono Style Guide

## はじめに

このスタイルガイドは、Preact、TypeScript、Vite 5、Honoを使用して開発するプロジェクトにおけるコーディング規約を定めたものです。コードの可読性、保守性、一貫性を高めることを目的としています。

## 基本原則

* **可読性:** チームメンバー全員が容易に理解できるコードを目指します。
* **保守性:** 変更や拡張が容易なコードを記述します。
* **一貫性:** プロジェクト全体で一貫したコーディングスタイルを維持し、エラーを削減します。
* **パフォーマンス:** 可読性を最優先としつつ、効率的なコードを心がけます。

## TypeScriptの利用

* **型注釈:** 型注釈を積極的に使用し、コンパイル時にエラーを検出しやすくします。
* **インターフェースと型:** 適切なインターフェースや型を定義し、コードの意図を明確にします。
* **`any` の回避:** `any` の使用は極力避け、具体的な型を指定します。

## Preactの利用

* **コンポーネント指向:** コンポーネントを適切に分割し、再利用性を高めます。
* **propsとstate:** propsとstateの管理を適切に行い、コンポーネントの責務を明確にします。
* **hooksの活用:** hooksを積極的に活用し、コンポーネントのロジックを簡潔にします。
* **JSX:** JSXの記述は、可読性を考慮し適切にフォーマットします。
* **型:** Preactの提供しているProps型などを利用して適切な型を利用する

## Honoの利用

* **ルーティング:** ルーティングを明確に定義し、APIの構成を整理します。
* **ミドルウェア:** ミドルウェアを活用し、共通処理を効率的に実装します。
* **エラーハンドリング:** 適切なエラーハンドリングを行い、APIの安定性を確保します。
* **レスポンス:** レスポンスの形式を統一し、APIの利用を容易にします。

## Vite 5の利用

* **設定:** `vite.config.ts` の設定を適切に行い、開発効率を高めます。
* **プラグイン:** 必要なプラグインを導入し、開発環境を最適化します。
* **ビルド:** ビルド設定を適切に行い、本番環境でのパフォーマンスを向上させます。

## コーディング規約

* **インデント:** 4つのスペースを使用します。
* **行の長さ:** 1行の最大文字数は120文字とします。
* **変数名:** `camelCase` を使用します。
* **定数名:** `UPPER_SNAKE_CASE` を使用します。
* **関数名:** `camelCase` を使用します。
* **クラス名:** `PascalCase` を使用します。
* **ファイル名:** `kebab-case` を使用します。
* **コメント:** コードの意図や背景を説明するコメントを適切に記述します。
* **ドキュメンテーション:** JSDocやTSDocを使用して、コードのドキュメントを記述します。

## ツール

* **ESLint:** JavaScript/TypeScriptの静的解析を行い、コードの品質を維持します。
* **Prettier:** コードのフォーマットを自動化し、一貫性を保ちます。
* **TypeScriptコンパイラ:** 型チェックを行い、コンパイル時にエラーを検出します。
* **Vite:** 開発サーバーとビルドツールとして使用します。

## ディレクトリ構造

```
src/
├── components/     # Preactコンポーネント
├── routes/         # Honoのルーティング
├── utils/          # ユーティリティ関数
├── types/          # 型定義
├── assets/         # 静的アセット
├── App.tsx         # アプリケーションのエントリーポイント
└── main.tsx        # Viteのエントリーポイント
```

## 例

### コンポーネントの例

```typescript
// src/components/Counter.tsx
import { useState } from 'preact/hooks';

interface CounterProps {
  initialCount: number;
}

const Counter: preact.ComponentType<CounterProps> = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

export default Counter;

Honoのルーティング例

```typescript
// src/routes/api.ts
import { Hono } from 'hono';

const api = new Hono();

api.get('/hello', (c) => {
  return c.json({ message: 'Hello, Hono!' });
});

export default api;
```

型定義例

```typescript
//src/types/message.d.ts
export interface Message {
  message:string
}
```
このスタイルガイドに従うことで、Preact、TypeScript、Vite 5、Honoを使用したプロジェクトをより効率的に開発し、高品質なコードを維持できます。