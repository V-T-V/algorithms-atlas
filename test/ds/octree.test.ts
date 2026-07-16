import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Octree, octree, type Box, type Point3D } from '../../src/algorithms/ds/octree/impl.ts';

const bounds: Box = { x1: 0, y1: 0, z1: 0, x2: 100, y2: 100, z2: 100 };
const pts: Point3D[] = [
  { x: 10, y: 10, z: 10 },
  { x: 90, y: 10, z: 10 },
  { x: 10, y: 90, z: 10 },
  { x: 90, y: 90, z: 90 },
  { x: 50, y: 50, z: 50 },
  { x: 51, y: 51, z: 51 },
  { x: 52, y: 52, z: 52 },
  { x: 25, y: 75, z: 25 },
];

function bruteRange(ps: Point3D[], b: Box): Point3D[] {
  return ps.filter(
    (p) => p.x >= b.x1 && p.x <= b.x2 && p.y >= b.y1 && p.y <= b.y2 && p.z >= b.z1 && p.z <= b.z2,
  );
}

test('octree 区域查询与暴力一致', () => {
  const ot = new Octree(bounds, 2);
  for (const p of pts) ot.insert(p);
  const queries: Box[] = [
    { x1: 0, y1: 0, z1: 0, x2: 100, y2: 100, z2: 100 },
    { x1: 48, y1: 48, z1: 48, x2: 54, y2: 54, z2: 54 },
    { x1: 0, y1: 0, z1: 0, x2: 20, y2: 20, z2: 20 },
    { x1: 80, y1: 80, z1: 80, x2: 100, y2: 100, z2: 100 },
  ];
  for (const q of queries) {
    const got = ot.queryRange(q).sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
    const exp = bruteRange(pts, q).sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
    assert.deepEqual(got, exp);
  }
});

test('octree 触发分裂', () => {
  const ot = new Octree(bounds, 2);
  for (const p of pts) ot.insert(p);
  const r = ot.queryRange({ x1: 48, y1: 48, z1: 48, x2: 54, y2: 54, z2: 54 });
  assert.equal(r.length, 3);
});

test('octree 边界外插入', () => {
  const ot = new Octree(bounds, 4);
  assert.equal(ot.insert({ x: 200, y: 0, z: 0 }), false);
  assert.equal(ot.insert({ x: 50, y: 50, z: 50 }), true);
});

test('octree 空查询', () => {
  const ot = new Octree(bounds, 4);
  for (const p of pts) ot.insert(p);
  assert.deepEqual(ot.queryRange({ x1: 60, y1: 60, z1: 60, x2: 70, y2: 70, z2: 70 }), []);
});

test('octree 便利函数', () => {
  const results = octree({
    bounds,
    capacity: 2,
    points: pts,
    queries: [{ x1: 0, y1: 0, z1: 0, x2: 100, y2: 100, z2: 100 }],
  });
  assert.equal(results[0]!.length, pts.length);
});

test('octree 钩子被调用', () => {
  let inserts = 0;
  let splits = 0;
  let hits = 0;
  const ot = new Octree(bounds, 2);
  for (const p of pts) ot.insert(p, { onInsert: () => inserts++, onSplit: () => splits++ });
  assert.equal(inserts, pts.length);
  assert.ok(splits >= 1, '应触发分裂');
  ot.queryRange({ x1: 48, y1: 48, z1: 48, x2: 54, y2: 54, z2: 54 }, { onQueryHit: () => hits++ });
  assert.equal(hits, 3);
});
