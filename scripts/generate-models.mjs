// SPDX-License-Identifier: Apache-2.0
// Generates MDX partials under docs/models/_generated/ from:
//
// - data/models.json         upstream (model-selector): families, models, license, ...
// - data/model-sources.json  upstream (model-selector): Hugging Face repo per model id
// - data/docs-overlay.json   docs-only: family HF collections, selector URL, signing method per model
//
// What's new is hand-written in docs/models/whats-new.mdx, not generated.
//
// The docs deliberately do not render per-model detail (benchmarks, usage, sizing):
// that lives on the Hugging Face model cards and in the model selector.
//
// Run via `npm run models:generate` (also runs automatically before `start` and `build`).
// To pull in updated upstream JSON files, run `npm run models:sync` first.

import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));

const catalog = readJson('data/models.json');
const sources = readJson('data/model-sources.json');
const overlay = readJson('data/docs-overlay.json');

const outDir = join(root, 'docs/models/_generated');
mkdirSync(outDir, {recursive: true});

const sourceById = new Map(sources.models.map((s, i) => [s.id, {...s, order: i}]));
const byHubOrder = (a, b) =>
  (sourceById.get(a.id)?.order ?? Infinity) - (sourceById.get(b.id)?.order ?? Infinity);
const modelsInFamily = (familyId) =>
  catalog.models.filter((m) => m.familyId === familyId).sort(byHubOrder);

// Escape characters that are significant in MDX or in Markdown table cells.
const esc = (value) =>
  String(value)
    .replace(/[{}]/g, (c) => `\\${c}`)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|');

const link = (text, url) => (url ? `[${esc(text)}](${url})` : esc(text));

const HEADER = '{/* GENERATED FILE. Do not edit. Run `npm run models:generate` to rebuild from data/*.json. */}';

const write = (name, lines) => {
  writeFileSync(join(outDir, name), [HEADER, '', ...lines, ''].join('\n'));
  console.log(`Generated docs/models/_generated/${name}`);
};

// Warn about overlay entries that no longer line up with the upstream catalog.
const familyIds = new Set(catalog.families.map((f) => f.id));
for (const id of Object.keys(overlay.families ?? {})) {
  if (!familyIds.has(id)) console.warn(`docs-overlay.json: unknown family "${id}"`);
}
for (const family of catalog.families) {
  if (!overlay.families?.[family.id]?.collection) {
    console.warn(`docs-overlay.json: no Hugging Face collection for family "${family.id}"`);
  }
}

// --- family-map.mdx: one row per family, linking out to its HF collection. ---
write('family-map.mdx', [
  '| Family | What it is for | Hugging Face |',
  '| ------ | -------------- | ------------ |',
  ...catalog.families
    .filter((family) => modelsInFamily(family.id).length > 0)
    .map((family) => {
      const collection = overlay.families?.[family.id]?.collection;
      return `| ${esc(family.name)} | ${esc(family.description)} | ${collection ? `[Collection](${collection})` : '—'} |`;
    }),
]);

// --- model-selector.mdx: a single link, since the selector has no deep links. ---
write('model-selector.mdx', [
  overlay.modelSelectorUrl
    ? `[Open the Granite model selector](${overlay.modelSelectorUrl})`
    : 'Granite model selector (link to be added in `data/docs-overlay.json`)',
]);

// --- licenses.mdx: license per model, grouped by family. ---
const licenseLines = [];
for (const family of catalog.families) {
  const models = modelsInFamily(family.id);
  if (models.length === 0) continue;
  licenseLines.push(
    `### ${esc(family.name)}`,
    '',
    '| Model | License |',
    '| ----- | ------- |',
    ...models.map((m) => `| ${link(m.name, sourceById.get(m.id)?.hf)} | ${esc(m.license ?? 'See model card')} |`),
    '',
  );
}
write('licenses.mdx', licenseLines);

// --- signing.mdx: signature method of each model's main repo, grouped by family. ---
const SIGNING_LABEL = {
  sigstore: '[Sigstore](#verify-a-sigstore-signed-model)',
  certificate: '[Certificate](#verify-a-certificate-signed-model)',
  mixed: '[Sigstore, or certificate for some adapters](#verify-a-granite-libraries-adapter)',
};
const signing = overlay.signing ?? {};
const signingLines = [];
for (const family of catalog.families) {
  const models = modelsInFamily(family.id);
  if (models.length === 0) continue;
  signingLines.push(
    `### ${esc(family.name)}`,
    '',
    '| Model | Signature |',
    '| ----- | --------- |',
    ...models.map((m) => {
      if (!(m.id in signing)) console.warn(`docs-overlay.json: no signing entry for "${m.id}"`);
      const method = signing[m.id];
      return `| ${link(m.name, sourceById.get(m.id)?.hf)} | ${method ? SIGNING_LABEL[method] ?? esc(method) : 'Not signed'} |`;
    }),
    '',
  );
}
write('signing.mdx', signingLines);

const missing = catalog.models.filter((m) => !m.license).map((m) => m.id);
if (missing.length) console.warn(`models.json: no license for ${missing.join(', ')}`);
