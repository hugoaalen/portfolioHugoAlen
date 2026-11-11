import { mkdir, readFile, writeFile } from 'node:fs/promises';

const project = process.env.PUBLIC_FIREBASE_PROJECT_ID;
const key = process.env.PUBLIC_FIREBASE_API_KEY;
if (!project || !key) throw new Error('Firebase configuration missing');
const base = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`;
function decode(value) {
  if ('mapValue' in value) return decodeFields(value.mapValue.fields ?? {});
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(decode);
  for (const type of ['stringValue', 'booleanValue', 'doubleValue', 'timestampValue', 'nullValue']) {
    if (type in value) return value[type];
  }
  if ('integerValue' in value) return Number(value.integerValue);
  return null;
}
function decodeFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([name, value]) => [name, decode(value)]));
}
const backup = { capturedAt: new Date().toISOString(), collections: {} };
const profileResponse = await fetch(`${base}/content/profile?key=${key}`);
if (!profileResponse.ok) throw new Error(`Profile backup failed: ${profileResponse.status}`);
backup.profile = decodeFields((await profileResponse.json()).fields ?? {});
for (const name of ['projects', 'about', 'experience', 'education']) {
  const filters = [{ fieldFilter: { field: { fieldPath: 'visible' }, op: 'EQUAL', value: { booleanValue: true } } }];
  if (name === 'projects') filters.push({ fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'published' } } });
  const response = await fetch(`${base}:runQuery?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: name }], where: filters.length === 1 ? filters[0] : { compositeFilter: { op: 'AND', filters } } } }),
  });
  if (!response.ok) throw new Error(`Backup failed for ${name}: ${response.status}`);
  backup.collections[name] = (await response.json()).filter((row) => row.document).map(({ document }) => ({ ...decodeFields(document.fields ?? {}), id: document.name.split('/').pop() }));
}
await mkdir('.private', { recursive: true });
await writeFile('.private/legacy-cms-backup.json', JSON.stringify(backup, null, 2));
for (const [name, items] of Object.entries(backup.collections)) {
  const local = JSON.parse(await readFile(`src/data/${name}.json`, 'utf8'));
  const ids = new Set(local.map((item) => item.id));
  console.log(`${name}: ${items.length} published; remote-only IDs: ${items.filter((item) => !ids.has(item.id)).map((item) => item.id).join(', ') || 'none'}`);
}
console.log('Published CMS snapshot saved privately. No remote data modified.');
