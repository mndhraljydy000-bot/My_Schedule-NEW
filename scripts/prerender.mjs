import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { build } from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

const SITE_URL = 'https://my-schedule-black.vercel.app';

if (!existsSync(distDir)) {
  console.error('[prerender] dist/ not found — run vite build first');
  process.exit(1);
}

const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

// Bundle the SSR entry (App rendered under react-dom/server) to run in Node
const ssrOutDir = join(rootDir, '.ssr-build');
const ssrBundle = await build({
  entryPoints: [join(rootDir, 'src/ssr-entry.tsx')],
  bundle: true,
  outdir: ssrOutDir,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
  external: ['react', 'react-dom', 'react-dom/server', 'react-router-dom'],
});

const { renderPage } = await import(
  pathToFileURL(join(ssrOutDir, 'ssr-entry.js')).href
);

const PAGES = [
  { key: 'home', path: '/', file: 'index.html' },
  { key: 'qiyas', path: '/qiyas', file: 'qiyas.html' },
  { key: 'tahsili', path: '/tahsili', file: 'tahsili.html' },
];

const PAGE_META = JSON.parse(readFileSync(join(rootDir, 'src', 'utils', 'seo-data.json'), 'utf-8'));

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"[^>]*content="[^"]*"`, 'i');
  const replacement = `<meta ${attr}="${key}" content="${escapeHtml(content)}"`;
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `  <meta ${attr}="${key}" content="${escapeHtml(content)}" />\n  </head>`);
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
}

function setCanonical(html, url) {
  const pattern = /<link\s+rel="canonical"[^>]*href="[^"]*"/i;
  const replacement = `<link rel="canonical" href="${url}"`;
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `  <link rel="canonical" href="${url}" />\n  </head>`);
}

function setJsonLdUrl(html, url) {
  return html.replace(/"url":\s*"[^"]*"/, `"url": "${url}"`);
}

function injectRootContent(html, appHtml) {
  const rootPattern = /<div id="root"><\/div>/;
  if (rootPattern.test(html)) {
    return html.replace(rootPattern, `<div id="root">${appHtml}</div>`);
  }
  // Fallback: replace empty or existing root content
  return html.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<script|$)/, `<div id="root">${appHtml}</div>`);
}

for (const page of PAGES) {
  const url = `${SITE_URL}${page.path}`;
  const meta = PAGE_META[page.key];

  let html = baseHtml;
  html = setTitle(html, meta.title);
  html = setMeta(html, 'name', 'description', meta.description);
  html = setMeta(html, 'property', 'og:title', meta.title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', meta.title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);
  html = setCanonical(html, url);
  html = setJsonLdUrl(html, url);

  const appHtml = renderPage(page.path);
  html = injectRootContent(html, appHtml);

  writeFileSync(join(distDir, page.file), html, 'utf-8');
  console.log(`[prerender] wrote dist/${page.file} (root: ${appHtml.length} chars)`);
}

console.log('[prerender] done');

rmSync(ssrOutDir, { recursive: true, force: true });
