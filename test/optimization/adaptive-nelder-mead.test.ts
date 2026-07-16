import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  adaptiveNelderMead,
  rosenbrock,
  demoFunc,
  adaptiveCoeffs,
} from '../../src/algorithms/optimization/adaptive-nelder-mead/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/optimization/adaptive-nelder-mead/trace.ts';

test('adaptiveCoeffs 随维度变化', () => {
  const c2 = adaptiveCoeffs(2);
  const c10 = adaptiveCoeffs(10);
  assert.equal(c2.alpha, 1);
  // γ = 1 + 2/n 随 n 增大而减小
  assert.ok(c10.gamma < c2.gamma, '高维扩张系数 γ 更小');
  // σ = 1 − 1/n 随 n 增大而增大（更接近 1）
  assert.ok(c10.sigma > c2.sigma, '高维缩边系数 σ 更大（接近 1）');
});

test('adaptive-nm 在球面函数上找到最优 (3,−1)', () => {
  const r = adaptiveNelderMead(demoFunc, [0, 0], { maxIter: 300 });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3);
  assert.ok(Math.abs(r.params[1]! - -1) < 1e-3);
});

test('adaptive-nm 在 Rosenbrock 上找到最优 (1,1)', () => {
  const r = adaptiveNelderMead(rosenbrock, [-1.2, 1], { maxIter: 500, tol: 1e-12 });
  assert.ok(Math.abs(r.params[0]! - 1) < 1e-2, `x≈1, got ${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! - 1) < 1e-2, `y≈1, got ${r.params[1]}`);
});

test('adaptive-nm 收敛', () => {
  const r = adaptiveNelderMead(demoFunc, [0, 0], { maxIter: 300, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(r.value < 1e-6);
});

test('adaptive-nm 钩子被调用', () => {
  let iters = 0;
  adaptiveNelderMead(demoFunc, [0, 0], { maxIter: 20 }, { onIter: () => iters++ });
  assert.ok(iters >= 1);
});

test('adaptive-nm 高维也能下降', () => {
  // 10 维球面
  const f10 = (x: number[]) => x.reduce((s, v, i) => s + (v - i) ** 2, 0);
  const r = adaptiveNelderMead(f10, new Array(10).fill(0), { maxIter: 1000 });
  assert.ok(r.value < 1); // 应显著下降
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧应含 aux');
});
