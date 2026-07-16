import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  interiorPoint,
  demoProblem,
} from '../../src/algorithms/optimization/interior-point/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/interior-point/trace.ts';

test('interior-point 求解经典问题（接近最优 z=36）', () => {
  const { A, b, c, expectZ } = demoProblem();
  const r = interiorPoint(A, b, c, { maxIterations: 200 });
  assert.ok(Math.abs(r.optimalValue - expectZ) < 1, `z≈${expectZ}, got ${r.optimalValue}`);
});

test('interior-point 解非负', () => {
  const { A, b, c } = demoProblem();
  const r = interiorPoint(A, b, c, { maxIterations: 100 });
  for (const v of r.solution) assert.ok(v >= -1e-6, `x 非负, got ${v}`);
});

test('interior-point 满足约束', () => {
  const { A, b, c } = demoProblem();
  const r = interiorPoint(A, b, c, { maxIterations: 100 });
  for (let i = 0; i < A.length; i++) {
    const lhs = A[i]!.reduce((s, a, j) => s + a * r.solution[j]!, 0);
    assert.ok(lhs <= b[i]! + 1e-3, `约束 ${i}: ${lhs} ≤ ${b[i]}`);
  }
});

test('interior-point 钩子被调用', () => {
  let iters = 0;
  const { A, b, c } = demoProblem();
  interiorPoint(A, b, c, { maxIterations: 20 }, { onIteration: () => iters++ });
  assert.ok(iters >= 5);
});

test('interior-point 单变量', () => {
  // max 2x, x ≤ 5 → z=10
  const r = interiorPoint([[1]], [5], [2], { maxIterations: 100 });
  assert.ok(Math.abs(r.optimalValue - 10) < 1, `z≈10, got ${r.optimalValue}`);
});

test('interior-point 目标随迭代改善', () => {
  const { A, b, c } = demoProblem();
  const objs: number[] = [];
  interiorPoint(A, b, c, { maxIterations: 30 }, { onIteration: (_i, _x, obj) => objs.push(obj) });
  // 路径跟踪法在中心化阶段允许轻微震荡（非严格单调），但整体趋势上升
  // 验证：初始 < 终态，且大多数相邻步进改善
  assert.ok(objs.length >= 3, '应至少 3 次迭代');
  assert.ok(
    objs[objs.length - 1]! > objs[0]!,
    `终态应优于初始: ${objs[0]} → ${objs[objs.length - 1]}`,
  );
  let improving = 0;
  for (let i = 1; i < objs.length; i++) {
    if (objs[i]! >= objs[i - 1]! - 1e-3) improving++;
  }
  assert.ok(
    improving >= objs.length - 2,
    `大多数步应非减（容差 1e-3），改善步数 ${improving}/${objs.length - 1}`,
  );
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
