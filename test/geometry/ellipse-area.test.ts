import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ellipseArea,
  ellipseAreaFromEccentricity,
  ellipsePerimeterRamanujan,
} from '../../src/algorithms/geometry/ellipse-area/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

test('ellipseArea: 基本公式 A = π·a·b', () => {
  assert.ok(close(ellipseArea(5, 3), 15 * Math.PI));
});

test('ellipseArea: a=b=r 时退化为圆面积', () => {
  assert.ok(close(ellipseArea(4, 4), 16 * Math.PI));
});

test('ellipseArea: a、b 顺序不影响结果', () => {
  assert.ok(close(ellipseArea(5, 3), ellipseArea(3, 5)));
});

test('ellipseArea: hooks 给出离心率', () => {
  let e: number | null = null;
  ellipseArea(5, 3, { onEccentricity: (ecc) => (e = ecc) });
  const expected = Math.sqrt(1 - 9 / 25);
  assert.ok(close(e!, expected));
});

test('ellipseArea: 圆的离心率 = 0', () => {
  let e: number | null = null;
  ellipseArea(4, 4, { onEccentricity: (ecc) => (e = ecc) });
  assert.ok(close(e!, 0));
});

test('ellipseAreaFromEccentricity: e=0 → 圆面积', () => {
  assert.ok(close(ellipseAreaFromEccentricity(3, 0), 9 * Math.PI));
});

test('ellipseAreaFromEccentricity: 与直接公式一致', () => {
  const a = 5;
  const e = 0.6;
  const b = a * Math.sqrt(1 - e * e);
  assert.ok(close(ellipseAreaFromEccentricity(a, e), Math.PI * a * b));
});

test('ellipsePerimeterRamanujan: 圆 → 2πr', () => {
  assert.ok(close(ellipsePerimeterRamanujan(3, 3), 6 * Math.PI, 1e-3));
});

test('ellipsePerimeterRamanujan: 已知椭圆周长近似', () => {
  // a=5,b=3 周长已知约 25.526（标准值）
  const p = ellipsePerimeterRamanujan(5, 3);
  assert.ok(p > 0 && Math.abs(p - 25.526) < 0.01, `got ${p}`);
});

test('ellipseArea: 非法入参抛错', () => {
  assert.throws(() => ellipseArea(0, 3), RangeError);
  assert.throws(() => ellipseArea(5, -1), RangeError);
  assert.throws(() => ellipseAreaFromEccentricity(5, 1), RangeError);
  assert.throws(() => ellipseAreaFromEccentricity(5, -0.1), RangeError);
});
