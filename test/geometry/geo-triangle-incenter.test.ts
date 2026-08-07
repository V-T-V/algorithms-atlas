import { test } from 'node:test';
import assert from 'node:assert/strict';
import { incenter } from '../../src/algorithms/geometry/geo-triangle-incenter/impl.ts';

const eq = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

test('内心 6-8-10 直角三角形内切圆半径 r=(a+b-c)/2', () => {
  // (0,0),(6,0),(0,8)：直角边 6 与 8，斜边 10；r=(6+8-10)/2=2
  const r = incenter({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  assert.ok(eq(r.radius, 2));
});

test('内心坐标 = 角点加权平均（按对边长度）', () => {
  const a = { x: 0, y: 0 };
  const b = { x: 6, y: 0 };
  const c = { x: 0, y: 8 };
  const la = Math.hypot(b.x - c.x, b.y - c.y); // 对 A 的边长
  const lb = Math.hypot(a.x - c.x, a.y - c.y);
  const lc = Math.hypot(a.x - b.x, a.y - b.y);
  const s = la + lb + lc;
  const expectX = (la * a.x + lb * b.x + lc * c.x) / s;
  const expectY = (la * a.y + lb * b.y + lc * c.y) / s;
  const r = incenter(a, b, c);
  assert.ok(eq(r.center.x, expectX) && eq(r.center.y, expectY));
});

test('内切圆半径 = 面积 / 半周长（不变量）', () => {
  const a = { x: -1, y: 2 };
  const b = { x: 4, y: 9 };
  const c = { x: -6, y: -3 };
  const r = incenter(a, b, c);
  const la = Math.hypot(b.x - c.x, b.y - c.y);
  const lb = Math.hypot(a.x - c.x, a.y - c.y);
  const lc = Math.hypot(a.x - b.x, a.y - b.y);
  const semi = (la + lb + lc) / 2;
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  assert.ok(eq(r.radius, area / semi));
});

test('等边三角形内心 = 重心', () => {
  const a = { x: 1, y: 0 };
  const b = { x: -0.5, y: Math.sqrt(3) / 2 };
  const c = { x: -0.5, y: -Math.sqrt(3) / 2 };
  const r = incenter(a, b, c);
  assert.ok(eq(r.center.x, 0) && eq(r.center.y, 0));
  // 等边三角形内切圆半径 = 外接圆半径 / 2 = 0.5
  assert.ok(eq(r.radius, 0.5));
});

test('内心 退化三角形（三点重合）报错', () => {
  assert.throws(
    () => incenter({ x: 2, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 2 }),
    RangeError,
  );
});
