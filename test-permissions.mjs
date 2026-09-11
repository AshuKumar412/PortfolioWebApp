/**
 * test-permissions.mjs
 * Run: node test-permissions.mjs
 * Verifies both public reads and authenticated admin CRUD on public.profile and storage
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

let url = '';
let key = '';

try {
  const envContent = readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      url = trimmed.split('=')[1].trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      key = trimmed.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error('Could not read .env:', e.message);
}

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

async function runTests() {
  console.log('Using Supabase URL:', url);

  console.log('\n--- 1. Testing Public Anon Read on Profile ---');
  const { data: pubData, error: pubErr } = await supabase
    .from('profile')
    .select('*')
    .limit(1);

  if (pubErr) {
    console.error('❌ Public read failed:', pubErr.message, pubErr.hint || '');
  } else {
    console.log('✅ Public read succeeded. Rows found:', pubData?.length);
  }

  console.log('\n--- 2. Testing Admin Authentication ---');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: '2400032678@kluniversity.in',
    password: 'Ashu@2005',
  });

  if (authErr) {
    console.error('❌ Admin auth failed:', authErr.message);
    return;
  }
  console.log('✅ Admin auth succeeded. User email:', authData.user.email);

  console.log('\n--- 3. Testing Admin Read & Update on Profile ---');
  const { data: profileRow, error: pGetErr } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (pGetErr) {
    console.error('❌ Admin profile read failed:', pGetErr.message, pGetErr.hint || '');
  } else {
    console.log('✅ Admin profile read succeeded. ID:', profileRow?.id);
    const testName = 'Alex Johnson';
    
    let saveRes;
    if (profileRow?.id) {
      saveRes = await supabase
        .from('profile')
        .update({ name: testName, updated_at: new Date().toISOString() })
        .eq('id', profileRow.id)
        .select()
        .single();
    } else {
      saveRes = await supabase
        .from('profile')
        .insert({ name: testName, title: 'Full-Stack Developer', is_available: true })
        .select()
        .single();
    }

    if (saveRes.error) {
      console.error('❌ Admin profile update/insert failed:', saveRes.error.message, saveRes.error.hint || '');
    } else {
      console.log('✅ Admin profile saved successfully! Current name:', saveRes.data.name);
    }
  }

  console.log('\n--- 4. Testing All Other Tables (Public SELECT) ---');
  const tables = ['projects', 'skills', 'education', 'experience', 'certifications', 'achievements', 'services', 'social_links', 'contact_messages'];
  for (const t of tables) {
    const { error: tErr } = await supabase.from(t).select('*').limit(1);
    if (tErr) {
      console.error(`❌ Table ${t}:`, tErr.message);
    } else {
      console.log(`✅ Table ${t}: OK`);
    }
  }

  console.log('\n--- 5. Testing Storage Buckets ---');
  for (const b of ['avatars', 'projects', 'certifications', 'resumes']) {
    const { data: files, error: fErr } = await supabase.storage.from(b).list();
    if (fErr) {
      console.error(`❌ Bucket ${b}:`, fErr.message);
    } else {
      console.log(`✅ Bucket ${b}: OK (${files.length} items)`);
    }
  }
}

runTests().catch(console.error);
