import { test } from 'node:test';
import assert from 'node:assert/strict';
import { centroid } from '../../src/algorithms/geometry/geo-triangle-centroid/impl.ts';

const eq = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

test('重心 3-4-5 直角三角形', () => {
  const g = centroid({ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 });
  assert.ok(eq(g.x, 1) && eq(g.y, 1));
});

test('重心 = 三顶点坐标平均', () => {
  const a = { x: -2, y: 5 };
  const b = { x: 4, y: -3 };
  const c = { x: 7, y: 9 };
  const g = centroid(a, b, c);
  assert.ok(eq(g.x, (a.x + b.x + c.x) / 3));
  assert.ok(eq(g.y, (a.y + b.y + c.y) / 3));
});

test('重心位于各中线 2:1 分点（重心定理）', () => {
  const a = { x: 0, y: 0 };
  const b = { x: 6, y: 0 };
  const c = { x: 0, y: 6 };
  const g = centroid(a, b, c);
  // BC 中点
  const mBC = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
  // A→mBC 方向上 G 距 A 占 2/3
  const t = 2 / 3;
  const expect = { x: a.x + t * (mBC.x - a.x), y: a.y + t * (mBC.y - a.y) };
  assert.ok(eq(g.x, expect.x) && eq(g.y, expect.y));
});

test('重心对退化三点仍返回坐标平均（不报错）', () => {
  const g = centroid({ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 1 });
  assert.ok(eq(g.x, 1) && eq(g.y, 1));
});
