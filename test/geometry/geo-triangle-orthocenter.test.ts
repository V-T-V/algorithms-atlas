import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orthocenter } from '../../src/algorithms/geometry/geo-triangle-orthocenter/impl.ts';
import { circumcenter } from '../../src/algorithms/geometry/geo-triangle-circumcenter/impl.ts';
import { centroid } from '../../src/algorithms/geometry/geo-triangle-centroid/impl.ts';

const eq = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

test('垂心 直角三角形=直角顶点', () => {
  const h = orthocenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(eq(h.x, 0) && eq(h.y, 0));
});

test('垂心 等边三角形=重心=原点', () => {
  const a = { x: 1, y: 0 };
  const b = { x: -0.5, y: Math.sqrt(3) / 2 };
  const c = { x: -0.5, y: -Math.sqrt(3) / 2 };
  const h = orthocenter(a, b, c);
  assert.ok(eq(h.x, 0) && eq(h.y, 0));
});

test('垂心在高线上：H 与 A 的连线垂直于 BC（垂心定义）', () => {
  const a = { x: 2, y: 5 };
  const b = { x: 8, y: 1 };
  const c = { x: -1, y: 3 };
  const h = orthocenter(a, b, c);
  // AH 向量
  const ahx = h.x - a.x;
  const ahy = h.y - a.y;
  // BC 向量
  const bcx = c.x - b.x;
  const bcy = c.y - b.y;
  // 点积应为 0
  assert.ok(eq(ahx * bcx + ahy * bcy, 0), 'AH 应垂直 BC');
});

test('欧拉线不变量：H、G、O 共线且 HG = 2·GO', () => {
  // 对非等边、非直角三角形验证欧拉线关系
  const a = { x: 1, y: 1 };
  const b = { x: 9, y: 2 };
  const c = { x: 3, y: 8 };
  const h = orthocenter(a, b, c);
  const o = circumcenter(a, b, c);
  const g = centroid(a, b, c);
  // G 在 H,O 之间且 HG = 2*GO → G = (H + 2*O)/3
  const gx = (h.x + 2 * o.center.x) / 3;
  const gy = (h.y + 2 * o.center.y) / 3;
  assert.ok(eq(gx, g.x) && eq(gy, g.y), '重心应满足 G=(H+2O)/3（欧拉线）');
});

test('垂心 共线三点报错', () => {
  assert.throws(
    () => orthocenter({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }),
    RangeError,
  );
});
