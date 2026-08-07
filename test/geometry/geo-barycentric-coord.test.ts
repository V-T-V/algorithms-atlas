import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barycentric } from '../../src/algorithms/geometry/geo-barycentric-coord/impl.ts';

const eq = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;
const A = { x: 0, y: 0 };
const B = { x: 1, y: 0 };
const C = { x: 0, y: 1 };

test('顶点 A 的 u=1（v=w=0）', () => {
  const r = barycentric({ x: 0, y: 0 }, A, B, C);
  assert.ok(eq(r.u, 1) && eq(r.v, 0) && eq(r.w, 0));
});

test('顶点 B 的 v=1', () => {
  const r = barycentric({ x: 1, y: 0 }, A, B, C);
  assert.ok(eq(r.u, 0) && eq(r.v, 1) && eq(r.w, 0));
});

test('顶点 C 的 w=1', () => {
  const r = barycentric({ x: 0, y: 1 }, A, B, C);
  assert.ok(eq(r.u, 0) && eq(r.v, 0) && eq(r.w, 1));
});

test('重心坐标 u+v+w 恒为 1（不变量）', () => {
  const samples = [
    { x: 0.2, y: 0.3 },
    { x: -1, y: 2 },
    { x: 5, y: 5 },
    { x: 0.5, y: 0.5 },
  ];
  for (const p of samples) {
    const r = barycentric(p, A, B, C);
    assert.ok(eq(r.u + r.v + r.w, 1), `${JSON.stringify(p)} 坐标和应为 1`);
  }
});

test('重心坐标可重建原点坐标 P = uA+vB+wC', () => {
  const p = { x: 0.3, y: 0.4 };
  const r = barycentric(p, A, B, C);
  const rx = r.u * A.x + r.v * B.x + r.w * C.x;
  const ry = r.u * A.y + r.v * B.y + r.w * C.y;
  assert.ok(eq(rx, p.x) && eq(ry, p.y));
});

test('点在三角形内 → 三个坐标均非负', () => {
  const p = { x: 0.2, y: 0.2 }; // 显然在 △ABC 内
  const r = barycentric(p, A, B, C);
  assert.ok(r.u >= -1e-9 && r.v >= -1e-9 && r.w >= -1e-9);
});

test('退化三角形（共线）报错', () => {
  assert.throws(
    () => barycentric({ x: 0.5, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }),
    RangeError,
  );
});
