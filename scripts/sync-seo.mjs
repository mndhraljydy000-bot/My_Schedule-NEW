/* Generates src/utils/seo-data.json from src/utils/seo-data.ts so that
 * scripts/prerender.mjs (Node) and the app (Vite) share one SEO source. */
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

await build({
  entryPoints: [join(rootDir, 'src/utils/seo-data.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: '.seo-data.tmp.mjs',
  external: ['../data/sources'],
});

const mod = await import(pathToFileURLSafe());
await writeFile(
  join(rootDir, 'src/utils/seo-data.json'),
  JSON.stringify(mod.PAGE_SEO, null, 2) + '\n',
  'utf-8',
);

function pathToFileURLSafe() {
  return 'file://' + join(rootDir, '.seo-data.tmp.mjs').replace(/\\/g, '/');
}
