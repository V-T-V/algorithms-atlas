import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QuadTree,
  quadTree,
  type Point,
  type Rect,
} from '../../src/algorithms/ds/quad-tree/impl.ts';

const bounds: Rect = { x1: 0, y1: 0, x2: 100, y2: 100 };
const pts: Point[] = [
  { x: 10, y: 10 },
  { x: 90, y: 10 },
  { x: 10, y: 90 },
  { x: 90, y: 90 },
  { x: 50, y: 50 },
  { x: 51, y: 51 },
  { x: 52, y: 52 },
  { x: 25, y: 75 },
];

function bruteRange(ps: Point[], r: Rect): Point[] {
  return ps.filter((p) => p.x >= r.x1 && p.x <= r.x2 && p.y >= r.y1 && p.y <= r.y2);
}

test('quad-tree 区域查询与暴力一致', () => {
  const qt = new QuadTree(bounds, 2);
  for (const p of pts) qt.insert(p);
  const queries: Rect[] = [
    { x1: 0, y1: 0, x2: 100, y2: 100 },
    { x1: 40, y1: 40, x2: 60, y2: 60 },
    { x1: 0, y1: 0, x2: 20, y2: 20 },
    { x1: 80, y1: 80, x2: 100, y2: 100 },
  ];
  for (const q of queries) {
    const got = qt.queryRange(q).sort((a, b) => a.x - b.x || a.y - b.y);
    const exp = bruteRange(pts, q).sort((a, b) => a.x - b.x || a.y - b.y);
    assert.deepEqual(got, exp, `query (${q.x1},${q.y1})-(${q.x2},${q.y2})`);
  }
});

test('quad-tree 触发分裂', () => {
  const qt = new QuadTree(bounds, 2);
  for (const p of pts) qt.insert(p);
  // 中间聚集多个点应导致深度增加
  const r = qt.queryRange({ x1: 48, y1: 48, x2: 54, y2: 54 });
  assert.equal(r.length, 3);
});

test('quad-tree 边界外插入被拒', () => {
  const qt = new QuadTree(bounds, 4);
  assert.equal(qt.insert({ x: 200, y: 200 }), false);
  assert.equal(qt.insert({ x: 50, y: 50 }), true);
});

test('quad-tree 空查询', () => {
  const qt = new QuadTree(bounds, 4);
  for (const p of pts) qt.insert(p);
  assert.deepEqual(qt.queryRange({ x1: 60, y1: 60, x2: 70, y2: 70 }), []);
});

test('quadTree 便利函数', () => {
  const results = quadTree({
    bounds,
    capacity: 2,
    points: pts,
    queries: [{ x1: 0, y1: 0, x2: 100, y2: 100 }],
  });
  assert.equal(results[0]!.length, pts.length);
});

test('quad-tree 钩子被调用', () => {
  let inserts = 0;
  let splits = 0;
  let hits = 0;
  const qt = new QuadTree(bounds, 2);
  for (const p of pts) qt.insert(p, { onInsert: () => inserts++, onSplit: () => splits++ });
  assert.equal(inserts, pts.length);
  assert.ok(splits >= 1, '应触发分裂');
  qt.queryRange({ x1: 48, y1: 48, x2: 54, y2: 54 }, { onQueryHit: () => hits++ });
  assert.equal(hits, 3);
});
