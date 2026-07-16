import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagCMAES, demoFunc } from '../../src/algorithms/optimization/diag-cma-es/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/optimization/diag-cma-es/trace.ts';

test('diag-cma-es 在球面函数上收敛到 (0,1,2)', () => {
  const r = diagCMAES(demoFunc, [5, -5, 3], { maxGenerations: 500, seed: 1 });
  assert.ok(Math.abs(r.mean[0]! - 0) < 0.1, `x0≈0, got ${r.mean[0]}`);
  assert.ok(Math.abs(r.mean[1]! - 1) < 0.1, `x1≈1, got ${r.mean[1]}`);
  assert.ok(Math.abs(r.mean[2]! - 2) < 0.1, `x2≈2, got ${r.mean[2]}`);
});

test('diag-cma-es 最优值接近 0', () => {
  const r = diagCMAES(demoFunc, [5, -5, 3], { maxGenerations: 500, seed: 1 });
  assert.ok(r.value < 1, `value 应接近 0, got ${r.value}`);
});

test('diag-cma-es σ 随代数下降', () => {
  const r = diagCMAES(demoFunc, [2, 2], { maxGenerations: 200, seed: 1, initSigma: 0.5 });
  assert.ok(r.sigma <= 0.5 + 1e-6, 'σ 不应增大太多');
});

test('diag-cma-es 对角方差为正', () => {
  const r = diagCMAES(demoFunc, [2, 2], { maxGenerations: 50, seed: 1 });
  for (const c of r.diagC) assert.ok(c > 0);
});

test('diag-cma-es 确定性', () => {
  const a = diagCMAES(demoFunc, [2, 2], { maxGenerations: 50, seed: 7 });
  const b = diagCMAES(demoFunc, [2, 2], { maxGenerations: 50, seed: 7 });
  assert.deepEqual(a.mean, b.mean);
});

test('diag-cma-es 钩子被调用', () => {
  let gens = 0;
  diagCMAES(demoFunc, [2, 2], { maxGenerations: 20, seed: 1 }, { onGeneration: () => gens++ });
  assert.ok(gens >= 10);
});

test('diag-cma-es 边界：低维（2D）收敛', () => {
  const f = (x: number[]) => x[0]! ** 2 + x[1]! ** 2;
  const r = diagCMAES(f, [3, 3], { maxGenerations: 300, seed: 42 });
  assert.ok(Math.abs(r.mean[0]!) < 0.2);
  assert.ok(Math.abs(r.mean[1]!) < 0.2);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
