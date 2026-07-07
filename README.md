# プレゼント抽選アプリ（lottery-app）

GitHub Pagesで公開できる、完全静的なプレゼント抽選アプリです。

想定公開URL: <https://kenitimor.github.io/lottery-app/>

## 機能

- 参加者を1行1名で登録
- 景品名と数量を編集
- ブラウザの暗号学的乱数（`crypto.getRandomValues`）で1枠ずつ抽選
- 当選者の重複を防止
- 抽選結果をリセット
- LocalStorageへの自動保存

## GitHub Pages対応

- `index.html` / `app.js` / `styles.css` のみで動作する静的サイトです。
- `.github/workflows/pages.yml` が `main` ブランチへのpushまたは手動実行でGitHub Pagesへデプロイします。
- `.nojekyll` を配置し、静的ファイルをそのまま配信します。
- `404.html` は `/lottery-app/` へ戻す簡易リダイレクトとして配置しています。

## ローカル起動

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:4173/` を開きます。

## 新リポジトリ作成後の反映手順

GitHub上で `kenitimor/lottery-app` を作成したら、以下で現在の内容を反映できます。

```bash
git remote add lottery-app https://github.com/kenitimor/lottery-app.git
git push lottery-app HEAD:main
```

GitHub Pagesは、リポジトリの **Settings > Pages** で Source を **GitHub Actions** に設定してください。
