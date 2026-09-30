#!/usr/bin/env node
/**
 * Scans src/data/*.ts for objects containing `sample: true` and prints
 * a grouped checklist: page → group → item → fields that need real info.
 *
 * Run:  npm run sample-report
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(scriptDir, '..', 'src', 'data');

const pageMap = {
  'about.ts': '/about',
  'contacts.ts': '/contact',
  'faq.ts': '/faq',
  'floorPlans.ts': '/residences',
  'listings.ts': '/residences',
};

const groupLabels = {
  facts: 'Facts strip',
  timeline: 'Timeline',
  boardMembers: 'Board members',
  contacts: 'Contact entries',
  faqCategories: 'FAQ items',
  floorPlans: 'Floor plans',
  listings: 'Listings',
};

const skipFields = new Set(['sample', 'id']);

function findObjectsWithSample(text) {
  const results = [];
  const sampleRegex = /sample:\s*true(?!\s*;)/g;
  let match;
  while ((match = sampleRegex.exec(text)) !== null) {
    let depth = 0;
    let i = match.index - 1;
    while (i >= 0) {
      const ch = text[i];
      if (ch === '}') depth++;
      else if (ch === '{') {
        if (depth === 0) break;
        depth--;
      }
      i--;
    }
    if (i < 0) continue;
    const start = i;
    depth = 0;
    let j = start;
    while (j < text.length) {
      const ch = text[j];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) break;
      }
      j++;
    }
    results.push({ start, end: j, text: text.slice(start, j + 1) });
  }
  return results;
}

function parseObjectFields(objText) {
  const inner = objText.slice(1, -1);
  const fields = {};
  let depth = 0;
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inString) {
      current += ch;
      if (ch === stringChar && inner[i - 1] !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      current += ch;
      continue;
    }
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
    if (depth === 0 && ch === ',') {
      parseField(current, fields);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parseField(current, fields);
  return fields;
}

function parseField(str, fields) {
  str = str.trim();
  const m = str.match(/^(\w+):\s*([\s\S]*)$/);
  if (!m) return;
  const key = m[1];
  let value = m[2].trim();
  value = value.replace(/^['"`]|['"`]$/g, '');
  fields[key] = value;
}

function getIdentifier(fields) {
  if (fields.question) return `"${fields.question}"`;
  if (fields.name) return fields.name;
  if (fields.role) return fields.role;
  if (fields.value && fields.label) return `${fields.value} (${fields.label})`;
  if (fields.value) return fields.value;
  if (fields.year) return fields.year;
  if (fields.id) return fields.id;
  return '(unnamed)';
}

function getContentFields(fields) {
  return Object.keys(fields).filter((k) => !skipFields.has(k));
}

function findNearestExport(text, position) {
  const before = text.slice(0, position);
  const matches = [...before.matchAll(/export\s+const\s+(\w+)/g)];
  return matches.length > 0 ? matches[matches.length - 1][1] : null;
}

function findNearestLabel(text, position) {
  const before = text.slice(0, position);
  const matches = [...before.matchAll(/label:\s*['"`]([^'"`]+)['"`]/g)];
  return matches.length > 0 ? matches[matches.length - 1][1] : null;
}

const files = readdirSync(dataDir).filter((f) => f.endsWith('.ts'));
const report = {};

for (const file of files) {
  if (!(file in pageMap)) continue;
  const text = readFileSync(join(dataDir, file), 'utf-8');
  const page = pageMap[file];
  const objects = findObjectsWithSample(text);
  if (objects.length === 0) continue;

  if (!report[page]) report[page] = {};

  for (const obj of objects) {
    const fields = parseObjectFields(obj.text);
    const exportName = findNearestExport(text, obj.start);
    const baseGroup = groupLabels[exportName] || exportName || file;

    let fullGroup = baseGroup;
    if (file === 'faq.ts') {
      const category = findNearestLabel(text, obj.start);
      if (category) fullGroup = `${category}`;
    }

    const id = getIdentifier(fields);
    const contentFields = getContentFields(fields);

    if (!report[page][fullGroup]) report[page][fullGroup] = [];
    report[page][fullGroup].push({ id, fields: contentFields });
  }
}

let totalItems = 0;
const pageNames = Object.keys(report).sort();

console.log('\n  Sample content report');
  console.log('  ══════════════════════════════════');

for (const page of pageNames) {
  const groups = report[page];
  let pageCount = 0;
  for (const g of Object.keys(groups)) pageCount += groups[g].length;
  totalItems += pageCount;

  console.log(`\n  ${page}  (${pageCount} item${pageCount !== 1 ? 's' : ''})`);
  for (const [group, items] of Object.entries(groups)) {
    console.log(`    ${group}`);
    for (const item of items) {
      console.log(`      [ ] ${item.id}`);
      console.log(`          needs: ${item.fields.join(', ')}`);
    }
  }
}

console.log(`\n  ${'─'.repeat(36)}`);
console.log(`  Total: ${totalItems} sample item${totalItems !== 1 ? 's' : ''} across ${pageNames.length} page${pageNames.length !== 1 ? 's' : ''}`);

if (totalItems === 0) {
  console.log('  All clear — no sample content remaining.\n');
} else {
  console.log('  Fix each item, then re-run until this reports 0 items.\n');
}
