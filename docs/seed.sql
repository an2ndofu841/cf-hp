-- Insert Dummy News
insert into news (slug, title_ja, title_en, body_ja, body_en, status, published_at, category)
values 
('hello-world', 'サイトリニューアルのお知らせ', 'Website Renewal', '公式サイトをリニューアルしました。', 'We have renewed our official website.', 'published', now(), 'info'),
('live-info-2026', '次回のライブ情報', 'Next Live Show', '次回のライブは2026年4月1日です。', 'Our next show is on April 1st, 2026.', 'published', now() - interval '1 day', 'live'),
('new-release', 'ニューシングル「8bit Heart」発売決定', 'New Single "8bit Heart" Release', '4月1日にニューシングルをリリースします。', 'We will release a new single on April 1st.', 'draft', now(), 'release')
on conflict (slug) do nothing;

-- Insert Dummy Venues & Lives
with new_venues as (
  insert into venues (name_ja, name_en, address_ja, address_en)
  values
  ('渋谷 WWW', 'Shibuya WWW', '東京都渋谷区宇田川町13-17', '13-17 Udagawacho, Shibuya, Tokyo'),
  ('新宿 LOFT', 'Shinjuku LOFT', '東京都新宿区歌舞伎町1-12-9', '1-12-9 Kabukicho, Shinjuku, Tokyo')
  returning id, name_en
)
insert into lives (title_ja, title_en, date, open_time, start_time, price_ja, status, venue_id)
select 
  'Crazy Night Vol.1', 'Crazy Night Vol.1', '2026-04-01 19:00:00+09'::timestamptz, '18:00', '19:00', '¥3,500', 'published'::content_status, id
from new_venues where name_en = 'Shibuya WWW'
union all
select 
  'Crazy Night Vol.2', 'Crazy Night Vol.2', '2026-05-05 18:30:00+09'::timestamptz, '17:30', '18:30', '¥3,500', 'published'::content_status, id
from new_venues where name_en = 'Shinjuku LOFT';
