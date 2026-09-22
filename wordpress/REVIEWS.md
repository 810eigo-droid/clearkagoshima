# 口コミセクションの差し替え（最新手順）

現在はプラグイン不要です。Googleの口コミリンク先は確認待ちのため、未設定のボタンは表示しません。content/wordpress-settings.json の reviews.googleUrl に確認済みURLを設定してビルドするとリンクが追加されます。現在の口コミ文と画像枠は維持しています。

## WordPressへの貼り付け順

共通CSSを1回設置し、次の5つを別々のカスタムHTMLブロックとして配置してください。

1. 01-sections-01-03.html
2. 02-sections-04-06.html
3. 03-sections-07-09-and-voices-heading.html（互換性のため旧ファイル名を維持。内容は07〜09のみ）
4. 03b-voices-section.html（独立した口コミセクション全体）
5. 04-sections-11-13-and-footer.html（11〜13とフッター）

## 将来プラグインへ変更するとき

4番だけを削除し、同じ位置に次の順で配置します。

1. reviews-heading.html をカスタムHTMLブロックへ（見出し・説明・画像枠）
2. 採用したプラグインのブロック、またはショートコードブロック
3. reviews-footer.html をカスタムHTMLブロックへ（注記・予約ボタン）

プラグイン部分を囲むグループに clear-lp-reviews クラスを設定してください。
03b-voices-section.html と上記分割ファイルを同時に使わないでください。
reviews-fallback.html はプラグインの代わりに既存の口コミ本文だけを表示したい場合の任意ファイルです。

## 口コミ画像

images/10.koe.webp を追加してビルドすると、枠を変えずに差し替わります。画像未追加時は既存画像を使います。Gitへの画像追加後はビルドと公開が必要です。
新しい画像を追加したコミットに合わせて imageBaseUrl も更新してください。

V1のHTMLと保存タグは変更していません。
