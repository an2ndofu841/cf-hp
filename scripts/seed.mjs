import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: In a real scenario with RLS, we might need a SERVICE_ROLE_KEY to bypass RLS for seeding,
// but our schema allows public read and authenticated write.
// For seeding from a script without a user session, we need the SERVICE_ROLE_KEY
// OR we need to relax RLS.
// Since I don't have the SERVICE_ROLE_KEY (only anon key was provided in previous turn),
// I will try to use the Anon Key.
// IF RLS is enabled and enforces "auth.role() = 'authenticated'", this might fail.
// However, I can try to sign in as a user or (if I had the service key) use that.
// Let's check the schema.sql policies again.
// create policy "Authenticated users can do all on news" ... using (auth.role() = 'authenticated');
// So anon key won't work for INSERT.

// I'll try to use the anon key but I suspect I need to sign up/in a user or get the service role key.
// Since the user only provided the anon key, I will assume I might need to Ask the user for the service role key
// OR I can guide the user to run the SQL in the dashboard.
// But the user asked ME to do it.

// Let's try to see if I can sign up a dummy admin user and use that to seed?
// Or I can ask the user for the service role key.

// Actually, for a quick start, I'll write the script to print the SQL to the console so the user can copy-paste it?
// No, the user said "Please do the dummy data" implying I should execute it.

// Let's try to write the script. If it fails due to RLS, I will report it.
// Wait, I can't use the service role key if I don't have it.
// The provided key in previous turn: "sb_publishable_..." and the JWT.
// The JWT provided is likely the ANON key.

// Alternative: I can temporarily disable RLS or add a policy for anon insert? No, that's bad security.
// The user has the SQL file.
// I will write the script to insert data.

// IMPORTANT: I will attempt to SignUp a temporary seed user if needed, but RLS usually requires an authenticated user.
// Let's try to create a user first? No, that sends an email.

// Let's check if the user gave me the service role key?
// "Publishable API Key ... You may also use the secret key which can be found here..."
// The user provided: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." which decodes to role: "anon".

// I cannot insert data with the Anon key if RLS is on for inserts.
// Schema: "create policy ... for all using (auth.role() = 'authenticated');"
// So I absolutely need authentication to insert.

// I will create a script that OUTPUTS the SQL statements with the correct IDs if possible?
// No, that's hard because I need venue IDs for lives.

// Best approach: I will create a script that generates a JSON or SQL that the user can run,
// OR (better) I will explain that I need the "Service_role" secret to seed the database from here,
// OR I can use the `signInWithPassword` if I had a user.

// Wait, I can just create the script and tell the user to run the SQL in the dashboard.
// But the user asked "Please do it".
// Maybe I can try to use the provided anon key and hope RLS isn't fully enforced yet?
// The schema.sql I wrote HAS RLS enabled.

// Let's try to write the script, but handle the error.
// If error, I will tell the user "I couldn't insert data because of RLS. Please run this SQL in your dashboard."

// Actually, I can use the SQL editor in Supabase Dashboard. The user has to do it.
// I will generate a refined `seed.sql` that handles the foreign keys using CTEs (Common Table Expressions).
// This way the user can just copy-paste one block of SQL.

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding data...');
  
  // 1. News
  const newsData = [
    { slug: 'hello-world', title_ja: 'サイトリニューアルのお知らせ', title_en: 'Website Renewal', body_ja: '公式サイトをリニューアルしました。', body_en: 'We have renewed our official website.', status: 'published', published_at: new Date().toISOString(), category: 'info' },
    { slug: 'live-info-2026', title_ja: '次回のライブ情報', title_en: 'Next Live Show', body_ja: '次回のライブは2026年4月1日です。', body_en: 'Our next show is on April 1st, 2026.', status: 'published', published_at: new Date(Date.now() - 86400000).toISOString(), category: 'live' },
    { slug: 'new-release', title_ja: 'ニューシングル「8bit Heart」発売決定', title_en: 'New Single "8bit Heart" Release', body_ja: '4月1日にニューシングルをリリースします。', body_en: 'We will release a new single on April 1st.', status: 'draft', published_at: new Date().toISOString(), category: 'release' }
  ];

  const { error: newsError } = await supabase.from('news').upsert(newsData, { onConflict: 'slug' });
  if (newsError) console.error('Error inserting news:', newsError.message);
  else console.log('News inserted.');

  // 2. Venues
  const venuesData = [
    { name_ja: '渋谷 WWW', name_en: 'Shibuya WWW', address_ja: '東京都渋谷区宇田川町13-17', address_en: '13-17 Udagawacho, Shibuya, Tokyo' },
    { name_ja: '新宿 LOFT', name_en: 'Shinjuku LOFT', address_ja: '東京都新宿区歌舞伎町1-12-9', address_en: '1-12-9 Kabukicho, Shinjuku, Tokyo' }
  ];
  
  const { data: createdVenues, error: venueError } = await supabase.from('venues').upsert(venuesData).select();
  if (venueError) {
      console.error('Error inserting venues:', venueError.message);
      return;
  }
  console.log('Venues inserted.');

  if (!createdVenues || createdVenues.length < 2) return;

  // 3. Lives
  const livesData = [
    { title_ja: 'Crazy Night Vol.1', title_en: 'Crazy Night Vol.1', date: '2026-04-01', open_time: '18:00', start_time: '19:00', price_ja: '¥3,500', status: 'published', venue_id: createdVenues[0].id },
    { title_ja: 'Crazy Night Vol.2', title_en: 'Crazy Night Vol.2', date: '2026-05-05', open_time: '17:30', start_time: '18:30', price_ja: '¥3,500', status: 'published', venue_id: createdVenues[1].id }
  ];

  const { error: livesError } = await supabase.from('lives').insert(livesData);
  if (livesError) console.error('Error inserting lives:', livesError.message);
  else console.log('Lives inserted.');
}

seed();
