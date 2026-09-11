/**
 * update-env.mjs
 * Run:  node update-env.mjs <SUPABASE_URL> <SUPABASE_ANON_KEY>
 * Example:
 *   node update-env.mjs https://abcxyz.supabase.co eyJhbGciOiJIUzI1NiIs...
 */
import { writeFileSync } from 'fs';

const [url, key] = process.argv.slice(2);

if (!url || !key) {
  console.error('\nUsage: node update-env.mjs <SUPABASE_URL> <ANON_KEY>\n');
  process.exit(1);
}

if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
  console.error('\nERROR: URL must look like https://xxxxxx.supabase.co\n');
  process.exit(1);
}

const content = `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${key}\n`;
writeFileSync('.env', content, 'utf8');

console.log('\n✅  .env updated successfully!\n');
console.log('   VITE_SUPABASE_URL =', url);
console.log('   VITE_SUPABASE_ANON_KEY = [set]\n');
console.log('Now restart the dev server:  npm run dev\n');
