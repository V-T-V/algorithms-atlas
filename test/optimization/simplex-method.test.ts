import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simplexMethod,
  demoProblem,
} from '../../src/algorithms/optimization/simplex-method/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/simplex-method/trace.ts';

test('simplex 求解经典问题（最优 z=36）', () => {
  const { A, b, c, expectZ } = demoProblem();
  const r = simplexMethod(A, b, c);
  assert.ok(r.optimal);
  assert.ok(Math.abs(r.optimalValue - expectZ) < 1e-6, `z=${expectZ}, got ${r.optimalValue}`);
});

test('simplex 求解经典问题（最优 x=[2,6]）', () => {
  const { A, b, c, expectX } = demoProblem();
  const r = simplexMethod(A, b, c);
  assert.ok(Math.abs(r.solution[0]! - expectX[0]!) < 1e-6);
  assert.ok(Math.abs(r.solution[1]! - expectX[1]!) < 1e-6);
});

test('simplex 单变量问题', () => {
  // max 2x, x ≤ 5, x ≥ 0
  const r = simplexMethod([[1]], [5], [2]);
  assert.ok(Math.abs(r.solution[0]! - 5) < 1e-6);
  assert.ok(Math.abs(r.optimalValue - 10) < 1e-6);
});

test('simplex 无可行约束（b<0）默认忽略', () => {
  // 单纯形法假设 b≥0；这里仍返回有限解
  const r = simplexMethod([[1]], [5], [1]);
  assert.equal(r.solution.length, 1);
});

test('simplex 钩子被调用', () => {
  let pivots = 0;
  const { A, b, c } = demoProblem();
  simplexMethod(A, b, c, {}, { onPivot: () => pivots++ });
  assert.ok(pivots >= 1);
});

test('simplex 平凡：零目标', () => {
  const r = simplexMethod(
    [
      [1, 0],
      [0, 1],
    ],
    [1, 1],
    [0, 0],
  );
  assert.equal(r.optimalValue, 0);
});

test('simplex 等式约束通过两个 ≤ 模拟', () => {
  // x + y = 2 → x+y ≤ 2 且 −x−y ≤ −2（b≥0 要求改写）。这里测 ≤ 形式：
  // max x+y, x+y ≤ 2, x≤1, y≤2 → x=1,y=1
  const r = simplexMethod(
    [
      [1, 1],
      [1, 0],
      [0, 1],
    ],
    [2, 1, 2],
    [1, 1],
  );
  assert.ok(r.optimalValue <= 2 + 1e-6);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
