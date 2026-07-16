import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RTree, rTree, type MBR, type RPoint } from '../../src/algorithms/ds/r-tree/impl.ts';

const bounds: MBR = { x1: 0, y1: 0, x2: 100, y2: 100 };
const pts: RPoint[] = [
  { x: 10, y: 10 },
  { x: 12, y: 11 },
  { x: 13, y: 10 },
  { x: 80, y: 80 },
  { x: 82, y: 81 },
  { x: 10, y: 90 },
  { x: 50, y: 50 },
  { x: 51, y: 49 },
];

function bruteRange(ps: RPoint[], m: MBR): RPoint[] {
  return ps.filter((p) => p.x >= m.x1 && p.x <= m.x2 && p.y >= m.y1 && p.y <= m.y2);
}

test('r-tree 区域查询与暴力一致', () => {
  const t = new RTree(bounds, 3);
  for (const p of pts) t.insert(p);
  const queries: MBR[] = [
    { x1: 0, y1: 0, x2: 100, y2: 100 },
    { x1: 9, y1: 9, x2: 14, y2: 12 },
    { x1: 78, y1: 78, x2: 85, y2: 85 },
    { x1: 60, y1: 60, x2: 70, y2: 70 },
  ];
  for (const q of queries) {
    const got = t.queryRange(q).sort((a, b) => a.x - b.x || a.y - b.y);
    const exp = bruteRange(pts, q).sort((a, b) => a.x - b.x || a.y - b.y);
    assert.deepEqual(got, exp);
  }
});

test('r-tree 触发分裂', () => {
  let splits = 0;
  const t = new RTree(bounds, 3);
  for (const p of pts) t.insert(p, { onSplit: () => splits++ });
  assert.ok(splits >= 1, '聚集插入应触发分裂');
});

test('r-tree MBR 单调扩张', () => {
  const t = new RTree(bounds, 4);
  t.insert({ x: 20, y: 20 });
  const mbr = t.rootMBR();
  t.insert({ x: 30, y: 30 });
  const mbr2 = t.rootMBR();
  assert.ok(mbr2.x2 >= mbr.x2 && mbr2.y2 >= mbr.y2);
});

test('r-tree 空查询', () => {
  const t = new RTree(bounds, 4);
  for (const p of pts) t.insert(p);
  assert.deepEqual(t.queryRange({ x1: 40, y1: 40, x2: 45, y2: 45 }), []);
});

test('rTree 便利函数', () => {
  const results = rTree({
    bounds,
    capacity: 3,
    points: pts,
    queries: [{ x1: 0, y1: 0, x2: 100, y2: 100 }],
  });
  assert.equal(results[0]!.length, pts.length);
});

test('r-tree 钩子被调用', () => {
  let inserts = 0;
  let visits = 0;
  let hits = 0;
  const t = new RTree(bounds, 3);
  for (const p of pts) t.insert(p, { onInsert: () => inserts++, onVisit: () => visits++ });
  assert.equal(inserts, pts.length);
  assert.ok(visits >= pts.length);
  t.queryRange({ x1: 9, y1: 9, x2: 14, y2: 12 }, { onQueryHit: () => hits++ });
  assert.ok(hits >= 1);
});
