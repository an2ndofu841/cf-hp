-- movies テーブルに説明・クレジットカラムを追加
alter table movies
  add column if not exists description_ja text,
  add column if not exists description_en text,
  add column if not exists credits text;

-- 初期データ：東京ダンジョン MV
insert into movies (title_ja, title_en, youtube_id, category, description_ja, credits, status, published_at)
values (
  '【LIVE MV】東京ダンジョン',
  '[LIVE MV] Tokyo Dungeon',
  'A2qamND6S-g',
  'mv',
  'Crazy Fantasy 公式MV',
  E'作詞・作曲・編曲\tJVNTA\n歌\tCrazy Fantasy',
  'published',
  now()
)
on conflict do nothing;
