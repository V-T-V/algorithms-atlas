import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lbfgs, type LBFGSHooks } from '../../src/algorithms/optimization/opt-l-bfgs/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-l-bfgs/trace.ts';

// 简单二次函数 f(x,y) = (x-3)^2 + (y+1)^2，最优 (3,-1)
const f1 = (x: number[]): number => (x[0]! - 3) ** 2 + (x[1]! + 1) ** 2;
const g1 = (x: number[]): number[] => [2 * (x[0]! - 3), 2 * (x[1]! + 1)];

// Rosenbrock
const fR = (x: number[]): number => (1 - x[0]!) ** 2 + 100 * (x[1]! - x[0]! ** 2) ** 2;
const gR = (x: number[]): number[] => [
  -2 * (1 - x[0]!) - 400 * x[0]! * (x[1]! - x[0]! ** 2),
  200 * (x[1]! - x[0]! ** 2),
];

test('opt-l-bfgs 二次函数收敛到 (3,-1)', () => {
  const r = lbfgs(f1, g1, [0, 0], { maxIter: 50, tol: 1e-10 });
  assert.ok(Math.abs(r.x[0]! - 3) < 1e-4, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! + 1) < 1e-4, `y=${r.x[1]}`);
});

test('opt-l-bfgs Rosenbrock 收敛到 (1,1)', () => {
  const r = lbfgs(fR, gR, [-1.2, 1], { maxIter: 200, tol: 1e-8 });
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-3, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1) < 1e-3, `y=${r.x[1]}`);
});

test('opt-l-bfgs 单步内值下降', () => {
  let prev = Infinity;
  let decreased = false;
  const hooks: LBFGSHooks = {
    onIter: (_i, _x, _g, value) => {
      if (value < prev) decreased = true;
      prev = value;
    },
  };
  lbfgs(f1, g1, [0, 0], { maxIter: 10, tol: 1e-12 }, hooks);
  assert.ok(decreased);
});

test('opt-l-bfgs 收敛标志', () => {
  const r = lbfgs(f1, g1, [0, 0], { maxIter: 50, tol: 1e-10 });
  assert.equal(r.converged, true);
});

test('opt-l-bfgs 钩子触发', () => {
  let iters = 0;
  let results = 0;
  lbfgs(
    f1,
    g1,
    [0, 0],
    { maxIter: 5, tol: 1e-12 },
    { onIter: () => iters++, onResult: () => results++ },
  );
  assert.ok(iters >= 1);
  assert.equal(results, 1);
});

test('opt-l-bfgs 高维收敛', () => {
  // n=5 的可分二次
  const n = 5;
  const target = [1, 2, 3, 4, 5];
  const f = (x: number[]): number => x.reduce((s, v, i) => s + (v - target[i]!) ** 2, 0);
  const g = (x: number[]): number[] => x.map((v, i) => 2 * (v - target[i]!));
  const r = lbfgs(f, g, [0, 0, 0, 0, 0], { maxIter: 100, tol: 1e-10 });
  for (let i = 0; i < n; i++) {
    assert.ok(Math.abs(r.x[i]! - target[i]!) < 1e-3);
  }
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const x = last.aux!.find((e) => e.label === 'x');
  assert.ok(x);
});
