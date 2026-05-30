/**
 * 搬移卡片：將 dayNum=4（13日）的 06.海雲台傳統市場 移到 dayNum=3（12日）
 * 執行：node scripts/move-card.js
 */

const PROJECT_ID = 'korea-travel-751da';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── REST helpers ──────────────────────────────────────────────────
async function fsGet(path) {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

async function fsList(col, filter) {
  // 用 runQuery (structuredQuery) 做 where 查詢
  const body = {
    structuredQuery: {
      from: [{ collectionId: col }],
      where: filter,
      orderBy: [{ field: { fieldPath: 'order' }, direction: 'ASCENDING' }],
    },
  };
  const res = await fetch(`${BASE}:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`runQuery → ${res.status}: ${await res.text()}`);
  return res.json();
}

function makeEqFilter(field, intVal) {
  return {
    fieldFilter: {
      field: { fieldPath: field },
      op: 'EQUAL',
      value: { integerValue: String(intVal) },
    },
  };
}

function makeCompositeFilter(...filters) {
  return { compositeFilter: { op: 'AND', filters } };
}

function fsVal(v) {
  if (typeof v === 'number') return { integerValue: String(v) };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(fsVal) } };
  if (v && typeof v === 'object') {
    return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, val]) => [k, fsVal(val)])) } };
  }
  return { nullValue: null };
}

function fromFsVal(v) {
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue  !== undefined) return Number(v.doubleValue);
  if (v.stringValue  !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.arrayValue)  return (v.arrayValue.values || []).map(fromFsVal);
  if (v.mapValue)    return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, val]) => [k, fromFsVal(val)]));
  return null;
}

async function fsSet(path, data) {
  const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, fsVal(v)]));
  const res = await fetch(`${BASE}/${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fsDelete(path) {
  const res = await fetch(`${BASE}/${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${path} → ${res.status}`);
}

// ── 主流程 ────────────────────────────────────────────────────────
async function main() {
  const FROM_DAY = 4; // June 13
  const TO_DAY   = 3; // June 12

  // 直接 GET day4-s06
  const docId = `day${FROM_DAY}-s06`;
  console.log(`\n直接讀取 sectionCards/${docId}...`);
  let doc;
  try {
    doc = await fsGet(`sectionCards/${docId}`);
  } catch (e) {
    console.log(`找不到 ${docId}，嘗試列出 dayNum=${FROM_DAY} 的所有卡片：`);
    // fallback: list the whole collection and filter
    const allRes = await fetch(`${BASE}/sectionCards`);
    const allJson = await allRes.json();
    const docs = allJson.documents || [];
    const candidates = docs.filter(d => {
      const f = d.fields || {};
      return fromFsVal(f.dayNum || {}) === FROM_DAY;
    });
    candidates.forEach(d => {
      const f = d.fields || {};
      console.log(' -', d.name.split('/').pop(), fromFsVal(f.num || {}), fromFsVal(f.title || {}));
    });
    return;
  }

  if (!doc.fields) {
    console.log('文件不存在');
    return;
  }

  const fields = doc.fields || {};
  const data = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromFsVal(v)]));

  console.log(`\n找到卡片：${docId}`);
  console.log('  num:', data.num, '  title:', data.title, '  order:', data.order);

  // 查詢目的地 day3 的最大 order（列出集合並篩選）
  console.log(`\n查詢 dayNum=${TO_DAY} 的現有卡片以決定 order...`);
  const allRes = await fetch(`${BASE}/sectionCards`);
  const allJson = await allRes.json();
  const allDocs = allJson.documents || [];
  const destDocs = allDocs.filter(d => {
    const f = d.fields || {};
    return fromFsVal(f.dayNum || {}) === TO_DAY;
  });
  const destOrders = destDocs.map(d => fromFsVal((d.fields.order) || { integerValue: '0' }));
  const maxOrder = destOrders.length > 0 ? Math.max(...destOrders) : 99;
  const newOrder = maxOrder + 1;

  console.log(`  目的地現有 order 最大值：${maxOrder}，新 order：${newOrder}`);

  // 新文件 ID：若原本是 day4-s06 就改成 day3-s06，否則保留
  const newDocId = docId.replace(`day${FROM_DAY}-`, `day${TO_DAY}-`);
  const newData  = { ...data, dayNum: TO_DAY, order: newOrder };

  console.log(`\n寫入 sectionCards/${newDocId}...`);
  await fsSet(`sectionCards/${newDocId}`, newData);
  console.log('  寫入完成');

  console.log(`\n刪除原文件 sectionCards/${docId}...`);
  await fsDelete(`sectionCards/${docId}`);
  console.log('  刪除完成');

  // 同步 cardOverrides（若有的話）
  const oldOverrideId = `day${FROM_DAY}-s${data.num}`;
  const newOverrideId = `day${TO_DAY}-s${data.num}`;
  try {
    const ov = await fsGet(`cardOverrides/${oldOverrideId}`);
    if (ov.fields) {
      const ovData = Object.fromEntries(Object.entries(ov.fields).map(([k, v]) => [k, fromFsVal(v)]));
      console.log(`\n同步 cardOverrides/${oldOverrideId} → ${newOverrideId}...`);
      await fsSet(`cardOverrides/${newOverrideId}`, { ...ovData, dayNum: TO_DAY });
      await fsDelete(`cardOverrides/${oldOverrideId}`);
      console.log('  cardOverrides 同步完成');
    }
  } catch {
    console.log('  無對應 cardOverride，跳過');
  }

  console.log('\n完成！06.海雲台傳統市場 已從 13日 移至 12日。');
}

main().catch(e => { console.error(e); process.exit(1); });
