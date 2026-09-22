# V1と画像版の比較

- 現在の index.html：PC・スマホ専用のファーストビュー画像を使用。
- v1.html：変更前のHTMLと写真コラージュ版。
- Gitタグ v1-before-image-hero：変更前のソース・画像・WordPress用ファイルを完全保存。

ファーストビュー以外のセクションは変更していません。
画像版は写真の訴求力と配色がページに合っています。ただしスマホでは画像内の補足文も縮小されるため、文字の読みやすさを最優先する場合はV1をおすすめします。

復元は content/wordpress-settings.json の hero.enabled を false にして node build.cjs を実行します。
比較ページは共通CSSを参照します。将来のCSS変更も含めて当時の状態を取り出す場合は上記Gitタグを使用してください。
