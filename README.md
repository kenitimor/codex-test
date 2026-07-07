# プレゼント抽選アプリ

Excelファイルでアップロードした参加者リストから、指定した人数をランダムに抽選するWebアプリです。

## 使い方

1. 参加者名を入力したExcelファイル（`.xlsx` または `.xls`）を用意します。
2. アプリ上でExcelファイルをアップロードします。
3. 「抽選で選ぶ人数」に当選者数を入力します。
4. 「抽選する」ボタンを押すと、当選者がランダムに表示されます。

## 開発

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:4173/` を開いて確認できます。

## GitHub Pagesで公開する

このリポジトリには、GitHub Pagesへ静的サイトをデプロイするGitHub Actionsワークフローが含まれています。

1. GitHubのリポジトリ設定で **Settings > Pages** を開きます。
2. **Build and deployment** の **Source** に **GitHub Actions** を選択します。
3. `main` ブランチへpushするか、Actions画面から **Deploy to GitHub Pages** ワークフローを手動実行します。
4. デプロイ完了後、Actionsの実行結果またはPages設定画面に公開URLが表示されます。

