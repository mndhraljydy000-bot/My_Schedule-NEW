import type { Page } from '../data/sources';

export const PAGE_PATHS: Record<Page, string> = {
  home: '/',
  qiyas: '/qiyas',
  tahsili: '/tahsili',
  schedule: '/schedule',
  notes: '/notes',
};

export function pathToPage(pathname: string): Page {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const match = (Object.keys(PAGE_PATHS) as Page[]).find((p) => PAGE_PATHS[p] === clean);
  return match ?? 'home';
}
