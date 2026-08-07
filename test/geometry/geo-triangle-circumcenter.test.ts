import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circumcenter } from '../../src/algorithms/geometry/geo-triangle-circumcenter/impl.ts';

const eq = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

test('外心 直角三角形（斜边中点）', () => {
  const r = circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 });
  assert.ok(eq(r.center.x, 2));
  assert.ok(eq(r.center.y, 1.5));
  assert.ok(eq(r.radius, 2.5));
});

test('外心 等边三角形（中心 = 重心，半径已知）', () => {
  // 边长 2 的等边三角形，顶点在 (1,0),(cos120,sin120),(cos240,sin240)
  const a = { x: 1, y: 0 };
  const b = { x: -0.5, y: Math.sqrt(3) / 2 };
  const c = { x: -0.5, y: -Math.sqrt(3) / 2 };
  const r = circumcenter(a, b, c);
  assert.ok(eq(r.center.x, 0) && eq(r.center.y, 0), '外心应在原点');
  assert.ok(eq(r.radius, 1), '外接圆半径 = 1');
});

test('外心 三顶点到圆心等距（不变量）', () => {
  const a = { x: 1, y: 2 };
  const b = { x: 5, y: 8 };
  const c = { x: -3, y: 4 };
  const r = circumcenter(a, b, c);
  const da = Math.hypot(a.x - r.center.x, a.y - r.center.y);
  const db = Math.hypot(b.x - r.center.x, b.y - r.center.y);
  const dc = Math.hypot(c.x - r.center.x, c.y - r.center.y);
  assert.ok(eq(da, r.radius), 'A 到圆心 = radius');
  assert.ok(eq(db, r.radius), 'B 到圆心 = radius');
  assert.ok(eq(dc, r.radius), 'C 到圆心 = radius');
});

test('外心 返回 radius 与定义一致（距 A 的距离）', () => {
  const r = circumcenter({ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 0, y: 8 });
  assert.ok(eq(r.radius, 5));
});

test('外心 共线报错', () => {
  assert.throws(
    () => circumcenter({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }),
    RangeError,
  );
});

test('外心 onCenter 钩子触发', () => {
  let called: { x: number; y: number } | null = null;
  const r = circumcenter({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }, {
    onCenter: (c) => (called = c),
  });
  assert.ok(called !== null, '钩子应被调用');
  assert.ok(eq(called!.x, r.center.x) && eq(called!.y, r.center.y));
});
