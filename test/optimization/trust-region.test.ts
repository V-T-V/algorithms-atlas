import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trustRegion,
  rosenbrock,
  demoFunc,
} from '../../src/algorithms/optimization/trust-region/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/optimization/trust-region/trace.ts';

test('trust-region 在球面上找到 (3,−1)', () => {
  const r = trustRegion(demoFunc, [0, 0], { maxIterations: 200 });
  assert.ok(Math.abs(r.x[0]! - 3) < 1e-2, `x≈3, got ${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! + 1) < 1e-2, `y≈-1, got ${r.x[1]}`);
});

test('trust-region 在 Rosenbrock 上找到 (1,1)', () => {
  const r = trustRegion(rosenbrock, [-1.2, 1], { maxIterations: 300, tolerance: 1e-8 });
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-1, `x≈1, got ${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1) < 1e-1, `y≈1, got ${r.x[1]}`);
});

test('trust-region 收敛', () => {
  const r = trustRegion(demoFunc, [0, 0], { maxIterations: 200, tolerance: 1e-8 });
  assert.ok(r.converged);
});

test('trust-region 半径在合理范围', () => {
  const r = trustRegion(demoFunc, [0, 0], { maxIterations: 50 });
  assert.ok(r.radius > 0 && r.radius <= 1e4);
});

test('trust-region 钩子被调用', () => {
  let iters = 0;
  trustRegion(demoFunc, [0, 0], { maxIterations: 30 }, { onIteration: () => iters++ });
  assert.ok(iters >= 1);
});

test('trust-region 单维问题', () => {
  const r = trustRegion((x) => (x[0]! - 5) ** 2, [0], { maxIterations: 100 });
  assert.ok(Math.abs(r.x[0]! - 5) < 1e-2);
});

test('trust-region 目标随迭代非增', () => {
  const objs: number[] = [];
  trustRegion(
    demoFunc,
    [0, 0],
    { maxIterations: 30 },
    { onIteration: (_i, _x, _r, value) => objs.push(value) },
  );
  for (let i = 1; i < objs.length; i++) {
    assert.ok(objs[i]! <= objs[i - 1]! + 1e-9, `目标非增: ${objs[i - 1]} → ${objs[i]}`);
  }
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
});
