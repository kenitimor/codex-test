# HCM Gate Navigator

日立建機の新事業開発テーマを、ステージゲート制度に沿って管理・可視化する完全静的MVPです。

## MVPスコープ

- 案件管理
- スコアリング
- Go/No-Go判定
- レビュー履歴

## 制約への対応

- サーバー無し: `index.html` / `app.js` / `styles.css` だけで動作します。
- DB無し: データはブラウザの LocalStorage に保存します。
- GitHub Pages対応: ルーティングはハッシュURL（例: `#/projects/icon-rider`）を使い、静的ホスティングで直接動きます。
- 外部API無し: MVPではAI、認証、ファイル連携を呼びません。

## 将来拡張しやすい設計

現時点では単一の静的JSですが、責務は以下の境界で分けています。

- データアクセス: `loadProjects()` / `saveProjects()` を SharePoint Lists、Dataverse、社内DB等へ置換可能
- AI連携: スコアや次論点を作るロジックを Azure OpenAI 呼び出しへ置換可能
- 認証: GitHub Pages上の静的UIに Microsoft Entra ID の MSAL.js 認証を追加可能
- ルーティング: ハッシュルーティングのため、GitHub Pagesで404設定なしに動作


## GitHub Pages対応チェック

- `next.config.js`: このMVPはNext.jsを使わない完全静的サイトのため不要です。
- `output: export`: Next.jsビルドを行わないため不要です。静的ファイルをそのままPagesへアップロードします。
- `basePath` / `assetPrefix`: 外部バンドルやNext.jsアセットを使わず、`index.html` から同一ディレクトリの `styles.css` / `app.js` を相対参照するため不要です。
- Router対策: アプリ内遷移は `#/projects/icon-rider` のようなハッシュルーティングです。GitHub Pagesのサブパス配信でもリロード時にサーバー側ルーティングへ依存しません。
- 直接URL対策: `404.html` を追加し、誤って `/projects/icon-rider` のようなパスへアクセスした場合も `#/projects/icon-rider` 形式へリダイレクトします。
- Jekyll無効化: `.nojekyll` を配置し、GitHub Pagesが静的ファイルをそのまま配信するようにしています。

## 起動方法

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:4173/` を開きます。

## 画面

- `#/` : ダッシュボード
- `#/projects` : 案件管理
- `#/projects/icon-rider` : 案件詳細・編集・スコアリング・レビュー履歴
- `#/reviews` : レビュー履歴一覧
- `#/scoring` : スコアリング項目・重み設定

## GitHub Pagesへの自動デプロイ

`.github/workflows/pages.yml` が、`main` ブランチへのpushまたは手動実行でリポジトリ直下の静的ファイルをGitHub Pagesへデプロイします。
