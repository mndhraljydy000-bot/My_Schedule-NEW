import type { Page } from '../data/sources';
import { PAGE_PATHS } from './routes';

const SITE_NAME = 'منظومة المذاكرة';
const SITE_URL = 'https://my-schedule-black.vercel.app';

const PAGE_SEO: Record<Page, { title: string; description: string }> = {
  home: {
    title: `${SITE_NAME} | جدول قدرات وتحصيلي + خطة مذاكرة مجانية`,
    description: 'منظومة المذاكرة: أنشئ جدول قدرات وجدول تحصيلي مجاناً بخطة مذاكرة تتابعية ذكية، مع تقويم فعلي وتتبع يومي يحفزك على الالتزام حتى يوم الاختبار.',
  },
  qiyas: {
    title: `جدول القدرات | تنظيم مذاكرة اختبار القدرات - ${SITE_NAME}`,
    description: 'أنشئ جدول قدرات مخصصاً لك: خطة تتابعية من التأسيس إلى التدريب الكمي واللفظي، مع تقويم فعلي وتتبع يومي. مجاناً مع منظومة المذاكرة.',
  },
  tahsili: {
    title: `جدول التحصيلي | تنظيم مذاكرة الاختبار التحصيلي - ${SITE_NAME}`,
    description: 'أنشئ جدول تحصيلي مجاناً: وزّع مذاكرة الرياضيات والفيزياء والكيمياء والأحياء على تقويم ذكي مع مراجعات وتتبع دقيق.',
  },
  schedule: {
    title: `جدولي | متابعة جدول المذاكرة - ${SITE_NAME}`,
    description: 'تابع جدول مذاكرتك اليومي للقدرات والتحصيلي، وأكد إنجاز مهامك، وحافظ على شعلة الاستمرارية.',
  },
  notes: {
    title: `المذكرة | ملاحظات المذاكرة - ${SITE_NAME}`,
    description: 'اكتب ملاحظاتك ومهامك وتواريخك المهمة للقدرات والتحصيلي في مذكرة محفوظة تلقائياً.',
  },
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

export function applyPageSeo(page: Page) {
  const { title, description } = PAGE_SEO[page];
  const url = `${SITE_URL}${PAGE_PATHS[page]}`;
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertCanonical(url);
}
