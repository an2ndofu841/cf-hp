# Crazy Fantasy 公式HP 要件定義書（更新版 v1）

## 1. 基本情報

- **システム名称**: Crazy Fantasy 公式HP
- **構成**: Vercel (Next.js) + Supabase
- **管理**: 独自CMS（サイト内 `/admin`）
- **コンセプト**: RPGゲーム（8bit/ファミコン風要素）
- **デザイン方針**: 8bit“風”を要素として使い、可読性優先。将来的に尖らせられる設計。
- **チケット販売／物販**: サイト内決済は行わず、外部リンク（Tiget/LivePocket/EC等）へ遷移

## 2. 目的 / ゴール

### 2.1 目的
- グループの世界観を伝え、初見ユーザーの理解とファン化を促進
- LIVE・NEWS・MOVIE等の最新情報を集約し、ファン行動（来場/視聴/購入/フォロー）を最大化
- 運営が独自CMSで更新できる状態を作り、情報の鮮度を担保
- 多言語対応により国内外の検索/流入を取りこぼさない

### 2.2 KPI（例）
- LIVE詳細 → 外部チケットリンククリック率
- GOODSページ → 外部ECクリック率
- MOVIE → YouTube遷移率/再生数
- 海外言語ページの閲覧比率・滞在時間
- NEWS更新頻度（週◯本など）

## 3. ページ構成（確定）

### 3.1 公開ページ（必須）
| ページ名 | URL例 | 備考 |
| --- | --- | --- |
| **TOP** | `/`, `/en` | 最新NEWS, 直近LIVE, MOVIE, GOODS |
| **NEWS** | `/news`, `/en/news` | 一覧/詳細。カテゴリ/タグ/固定表示 |
| **LIVE** | `/live`, `/en/live` | 一覧/詳細。直近/過去切替。チケットリンク |
| **PROFILE** | `/profile`, `/en/profile` | グループ紹介, メンバー一覧/詳細 |
| **DISCOGRAPHY** | `/disco`, `/en/disco` | 楽曲/アルバム一覧, 配信リンク |
| **MOVIE** | `/movie`, `/en/movie` | YouTube埋め込み, カテゴリ/プレイリスト |
| **GOODS** | `/goods`, `/en/goods` | グッズ一覧, 外部ECへの導線 |
| **GALLERY** | `/gallery`, `/en/gallery` | 写真（アー写/ライブ/オフショ） |
| **PRESS KIT** | `/press`, `/en/press` | メディア向け素材DL, プロフィール文 |
| **CONTACT** | `/contact`, `/en/contact` | フォーム（出演依頼/取材/その他） |
| **PRIVACY/TERMS** | `/privacy`, `/terms` | 規約系 |

### 3.2 管理ページ（独自CMS）
- `/admin` (ログイン必須)
- ダッシュボード
- コンテンツ管理: NEWS, LIVE, MEMBER, DISCO, MOVIE, GOODS, GALLERY, PRESS KIT
- マスタ管理: 会場 (VENUE)
- 設定: SNSリンク, OGP, 翻訳管理

## 4. 多言語対応（要件）

### 4.1 対応言語
- **日本語 (ja)**
- **英語 (en)**
- ※将来的に zh, ko 等を追加可能な設計にする

### 4.2 URL/ルーティング
- **方式**: サブパス方式 (`/ja/...`, `/en/...`)
- **デフォルト**: 日本からのアクセスは `/ja`, 海外からは `/en`（または言語選択挟む）
- 言語切替ボタンを全ページ常設

### 4.3 翻訳運用 (CMS)
- 各コンテンツは言語ごとのフィールドを持つ (`title_ja`, `title_en` 等)
- 翻訳ステータス管理: `missing` / `draft` / `reviewed` / `published`
- 管理画面で「日本語だけ更新され、英語が古い」状態を警告表示

### 4.4 SEO
- `hreflang` タグの設定
- 言語ごとに `sitemap.xml` を生成
- OGP (画像/タイトル/説明) も言語に応じて出し分け

## 5. デザイン要件

### 5.1 方向性（8bit要素 × 可読性）
- **ベース**: モダンで読みやすいレイアウト（余白、行間、カードUI）
- **8bit要素**: UIパーツとして使用（ウィンドウ枠、コマンド選択カーソル、ドット絵アイコン、見出し装飾）
- **拡張性**: 将来的に「テーマ切替」で8bit度合いを強められるようコンポーネント設計する

### 5.2 フォント方針
- **見出し・UI**: ピクセルフォント（ビットマップ風）
- **本文**:
    - ピクセル寄りの可読フォント、またはピクセルフォント（サイズ・行間調整済み）
    - **最優先**: スマートフォンでの可読性。読みにくい場合は補助フォント（ゴシック体等）を併用。

## 6. 機能要件

### 6.1 共通
- ヘッダー/フッター（SNSリンク, 言語切替）
- パンくずリスト（SEO/回遊性）
- ローディング演出（8bit風）

### 6.2 各ページ詳細
- **TOP**: 最新情報（NEWS/LIVE/MOVIE/GOODS）の抜粋表示。「コマンドUI」風メニュー。
- **NEWS**: カテゴリ分類, 固定記事(pinned), 予約公開。
- **LIVE**: 日時, 会場, 料金, 出演者, チケットリンク(複数可)。Google Mapsリンク。過去ライブアーカイブ。
- **PROFILE**: ステータス画面風のメンバー紹介。SNSリンク。
- **DISCO**: ジャケット画像, トラックリスト, 各種配信サービスへのリンク。
- **MOVIE**: YouTube埋め込み。カテゴリ分け。
- **GOODS**: 商品画像, 価格, 説明, 「購入する」ボタン（外部ECへ）。在庫状況表示（任意）。
- **PRESS KIT**: ロゴ/アー写のダウンロード（一括/個別）。プロフィールテキスト（コピー用）。
- **CONTACT**: 問い合わせ種別選択。自動返信メール。

## 7. システム・非機能要件

### 7.1 技術スタック
- **Frontend**: Next.js (App Router), Vercel
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS (予定)

### 7.2 CMS要件 (Supabase)
- **認証**: Supabase Auth (Email/Password)
- **権限管理**:
    - `Admin`: ユーザー管理含む全権限
    - `Editor`: コンテンツ編集・公開
    - `Viewer`: 閲覧のみ
- **セキュリティ**: RLS (Row Level Security) を適用。管理画面はMiddleware等で保護。
- **画像管理**: Supabase Storage。Next/Imageでの最適化。

### 7.3 パフォーマンス・SEO
- SSG + ISR (Incremental Static Regeneration) で高速配信
- LCP (Largest Contentful Paint) 改善
- 構造化データ (JSON-LD) の実装 (Event, Organization)

## 8. 独自CMSデータモデル要件

### 8.1 共通カラム
- `id`, `created_at`, `updated_at`, `updated_by`
- `status` (draft, published, archived)
- `published_at` (予約公開用)

### 8.2 主要テーブル（言語別フィールドを持つ方針）
- **news**: `title_ja/en`, `body_ja/en`, `slug`, `category`, `tags`, `eyecatch`, `pinned`
- **live**: `title_ja/en`, `description_ja/en`, `date`, `venue_id`, `ticket_urls`, `status`
- **member**: `name_ja/en`, `profile_ja/en`, `role`, `sns_links`, `images`
- **discography**: `title_ja/en`, `type`, `release_date`, `tracks_ja/en`, `links`
- **movie**: `title_ja/en`, `youtube_id`, `category`
- **goods**: `name_ja/en`, `price_text_ja/en`, `external_url`, `sold_out`
- **venue**: `name_ja/en`, `address_ja/en`, `map_url`, `access_ja/en`
- **presskit**: `file_url`, `label_ja/en`, `type`
- **settings**: サイト全体設定（SNSリンク、デフォルトOGP等）

## 9. 実装計画

1.  **Phase 0: 仕様確定・準備**
    *   ワイヤーフレーム作成 (TOP/LIVE/NEWS/PRESS)
    *   DB設計 (Schema) & Supabaseセットアップ
    *   デザインシステム（8bit UIコンポーネント）策定
2.  **Phase 1: 基盤構築**
    *   Next.js プロジェクトセットアップ
    *   i18n ルーティング実装
    *   Supabase Auth & Client 連携
3.  **Phase 2: コンテンツ実装（公開側）**
    *   各ページコンポーネント実装
    *   API連動
4.  **Phase 3: CMS実装**
    *   管理画面UI実装
    *   CRUD機能、画像アップロード
5.  **Phase 4: 仕上げ**
    *   SEO設定, OGP確認
    *   パフォーマンスチューニング
    *   最終テスト
