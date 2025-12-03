import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const manifestPath = resolve(root, 'manifest.json');
let capabilities = [];
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  capabilities = manifest.capabilities ?? [];
  cpSync(manifestPath, resolve(dist, 'manifest.json'));
  console.log('[postbuild] copied manifest.json to dist/');
}

// Fix asset URLs in index.html - remove leading slashes from /assets/... paths
const indexHtmlPath = resolve(dist, 'ui/index.html');
if (existsSync(indexHtmlPath)) {
  let html = readFileSync(indexHtmlPath, 'utf8');
  html = html.replace(
    /((?:src|href)=["'])\/(assets\/[^"']*)(["'])/gi,
    '$1$2$3'
  );
  writeFileSync(indexHtmlPath, html, 'utf8');
  console.log('[postbuild] removed leading slashes from asset URLs in index.html');
}
