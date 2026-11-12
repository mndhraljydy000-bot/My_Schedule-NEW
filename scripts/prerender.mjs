import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const SITE_URL = 'https://my-schedule-black.vercel.app';
const SITE_NAME = 'منظومة المذاكرة';

if (!existsSync(distDir)) {
  console.error('[prerender] dist/ not found — run vite build first');
  process.exit(1);
}

const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

const QIYAS_SOURCES = {
  foundation: ['المعاصر', 'إينشتاين', 'المنصف', 'محمد المرشد'],
  'training-quant': ['المنصف', 'المفكر'],
  'training-verbal': ['دورة إيهاب عبد العظيم'],
};

const TAHSILI_SOURCES = [
  { name: 'ناصر عبدالكريم', desc: 'شرح شامل لمواد التحصيلي' },
  { name: 'يلو', desc: 'دروس مرئية لجميع المواد' },
  { name: 'غشام', desc: 'مراجعات وتدريبات' },
  { name: 'إينشتاين', desc: 'تأسيس وتدريب متقدم' },
];

const TAHSILI_SUBJECTS = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء'];

const PAGES = {
  home: {
    path: '/',
    title: `${SITE_NAME} | جدول قدرات وتحصيلي + خطة مذاكرة مجانية`,
    description:
      'منظومة المذاكرة: أنشئ جدول قدرات وجدول تحصيلي مجاناً بخطة مذاكرة تتابعية ذكية، مع تقويم فعلي وتتبع يومي يحفزك على الالتزام حتى يوم الاختبار.',
    ogDescription:
      'نظّم وقتك مع أفضل موقع لتنظيم جداول المذاكرة للقدرات والتحصيلي. خطة مذاكرة مجانية، خطط تتابعية ذكية، تقويم فعلي، تتبع دقيق، وشعلة استمرارية تحفزك على الالتزام يومياً.',
    body: `
      <h1>منظومة المذاكرة: جدول قدرات وجدول تحصيلي مجاناً</h1>
      <p>منظومة المذاكرة منصة مجانية لتنظيم مذاكرة اختبارات القدرات والتحصيلي، تبني لك جدول قدرات أو جدول تحصيلي بخطة تتابعية ذكية مع تقويم فعلي وتتبع يومي.</p>
      <ul>
        <li>جدول قدرات مخصص: تدرّج من التأسيس إلى التدريب الكمي واللفظي.</li>
        <li>جدول تحصيلي مخصص: توزيع المواد العلمية على تقويم فعلي.</li>
        <li>تتبع يومي وشعلة استمرارية تساعدك على الالتزام.</li>
      </ul>`,
  },
  qiyas: {
    path: '/qiyas',
    title: `جدول القدرات | تنظيم مذاكرة اختبار القدرات - ${SITE_NAME}`,
    description:
      'أنشئ جدول قدرات مخصصاً لك: خطة تتابعية من التأسيس إلى التدريب الكمي واللفظي، مع تقويم فعلي وتتبع يومي. مجاناً مع منظومة المذاكرة.',
    ogDescription:
      'جدول قدرات مخصص بخطة تتابعية من التأسيس إلى التدريب الكمي واللفظي، مع تقويم فعلي وتتبع يومي. مجاناً مع منظومة المذاكرة.',
    body: `
      <h1>قسم القدرات</h1>
      <p>اختر مصدراً واحداً من كل قسم — التأسيس، التدريب الكمي، والتدريب اللفظي — وأنشئ جدول مذاكرة ذكياً لاختبار القدرات.</p>
      <h2>مصادر التأسيس</h2>
      <ul>${QIYAS_SOURCES.foundation.map((s) => `<li>${s}</li>`).join('')}</ul>
      <h2>مصادر التدريب الكمي</h2>
      <ul>${QIYAS_SOURCES['training-quant'].map((s) => `<li>${s}</li>`).join('')}</ul>
      <h2>مصادر التدريب اللفظي</h2>
      <ul>${QIYAS_SOURCES['training-verbal'].map((s) => `<li>${s}</li>`).join('')}</ul>`,
  },
  tahsili: {
    path: '/tahsili',
    title: `جدول التحصيلي | تنظيم مذاكرة الاختبار التحصيلي - ${SITE_NAME}`,
    description:
      'أنشئ جدول تحصيلي مجاناً: وزّع مذاكرة الرياضيات والفيزياء والكيمياء والأحياء على تقويم ذكي مع مراجعات وتتبع دقيق.',
    ogDescription:
      'جدول تحصيلي مجاني يوزّع مذاكرة الرياضيات والفيزياء والكيمياء والأحياء على تقويم ذكي مع مراجعات وتتبع دقيق.',
    body: `
      <h1>قسم التحصيلي</h1>
      <p>اختر مصدر مذاكرة وحدد المواد التي تريد المذاكرة فيها، وأنشئ جدول مذاكرة ذكياً للاختبار التحصيلي.</p>
      <h2>المواد المتاحة</h2>
      <ul>${TAHSILI_SUBJECTS.map((s) => `<li>${s}</li>`).join('')}</ul>
      <h2>مصادر التحصيلي</h2>
      <ul>${TAHSILI_SOURCES.map((s) => `<li><strong>${s.name}</strong>: ${s.desc}</li>`).join('')}</ul>`,
  },
};

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setMeta(html, attr, key, content) {
  const pattern = new RegExp(
    `<meta\\s+${attr}="${key}"[^>]*content="[^"]*"`,
    'i'
  );
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

function replaceNoscriptBody(html, bodyContent) {
  const pattern = /<noscript>[\s\S]*?<\/noscript>/;
  const replacement = `<noscript>\n      <main dir="rtl" lang="ar" style="font-family: sans-serif; max-width: 640px; margin: 48px auto; padding: 0 24px; line-height: 1.5;">\n        ${bodyContent.trim()}\n        <p>لتصفح المنصة وإنشاء جدولك، يرجى تفعيل JavaScript في متصفحك.</p>\n      </main>\n    </noscript>`;
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace(
    '<div id="root">',
    `${replacement}\n    <div id="root">`
  );
}

function renderPage(pageKey) {
  const page = PAGES[pageKey];
  const url = `${SITE_URL}${page.path}`;
  let html = baseHtml;

  html = setTitle(html, page.title);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.ogDescription);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', page.title);
  html = setMeta(html, 'name', 'twitter:description', page.ogDescription);
  html = setCanonical(html, url);
  html = setJsonLdUrl(html, url);
  html = replaceNoscriptBody(html, page.body);

  return html;
}

// Home: overwrite dist/index.html with corrected content
const homeHtml = renderPage('home');
writeFileSync(join(distDir, 'index.html'), homeHtml, 'utf-8');
console.log('[prerender] wrote dist/index.html');

// /qiyas → dist/qiyas.html
const qiyasHtml = renderPage('qiyas');
writeFileSync(join(distDir, 'qiyas.html'), qiyasHtml, 'utf-8');
console.log('[prerender] wrote dist/qiyas.html');

// /tahsili → dist/tahsili.html
const tahsiliHtml = renderPage('tahsili');
writeFileSync(join(distDir, 'tahsili.html'), tahsiliHtml, 'utf-8');
console.log('[prerender] wrote dist/tahsili.html');

console.log('[prerender] done — 3 pages pre-rendered');
