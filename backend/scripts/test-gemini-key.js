/**
 * Test your Gemini API key against Google's REST API.
 * Run from backend folder: node -r dotenv/config scripts/test-gemini-key.js dotenv_config_path=.env
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const key = (process.env.GEMINI_API_KEY || '').trim();

if (!key) {
  console.error('GEMINI_API_KEY is not set in backend/.env');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

(async () => {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    const names = (data.models || []).map((m) => m.name).filter(Boolean);
    console.log('Key is valid. Available models:', names.length);
    names.slice(0, 10).forEach((n) => console.log('  -', n));
    if (names.length > 10) console.log('  ... and', names.length - 10, 'more');
    return;
  }
  console.error('Key rejected. Status:', res.status, res.statusText);
  console.error('Response:', JSON.stringify(data, null, 2));
  if (data.error && data.error.message) {
    console.error('\nIf you see API_KEY_INVALID:');
    console.error('  1. Create key at https://aistudio.google.com/apikey');
    console.error('  2. Use "Create API key in NEW project" (not existing) so the API is enabled.');
    console.error('  3. If you used an existing project: enable "Generative Language API" in Cloud Console.');
    console.error('  4. In Credentials, open the key and set API restrictions to "Don\'t restrict key" or add "Generative Language API".');
  }
})();
