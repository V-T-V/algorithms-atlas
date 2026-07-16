import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lagrangeInterpolate,
  type DataPoint,
} from '../../src/algorithms/numerical/lagrange/impl.ts';

test('lagrange 在数据点处精确', () => {
  const pts: DataPoint[] = [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 2 },
    { x: 3, y: 4 },
  ];
  for (const p of pts) {
    assert.ok(Math.abs(lagrangeInterpolate(pts, p.x) - p.y) < 1e-9);
  }
});

test('lagrange 线性插值', () => {
  const pts: DataPoint[] = [
    { x: 0, y: 0 },
    { x: 2, y: 4 },
  ];
  assert.ok(Math.abs(lagrangeInterpolate(pts, 1) - 2) < 1e-9);
});

test('lagrange 二次插值', () => {
  const pts: DataPoint[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 4 },
  ]; // y = x²
  assert.ok(Math.abs(lagrangeInterpolate(pts, 1.5) - 2.25) < 1e-9);
});

test('lagrange 单点', () => {
  assert.equal(lagrangeInterpolate([{ x: 0, y: 5 }], 100), 5);
});

test('lagrange 钩子被调用', () => {
  let calls = 0;
  lagrangeInterpolate(
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    0.5,
    { onBasis: () => calls++ },
  );
  assert.equal(calls, 2);
});
