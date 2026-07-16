import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  trustRegionDogleg,
  doglegStep,
  numGrad,
  numHessian,
  type DoglegHooks,
  type Vec,
} from '../../src/algorithms/optimization/opt-trust-region-dogleg/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-trust-region-dogleg/trace.ts';

const f = (x: Vec): number => (x[0]! - 1) ** 2 + 2 * (x[1]! - 2) ** 2;

test('opt-trust-region-dogleg 收敛到 (1,2)', () => {
  const r = trustRegionDogleg(f, [5, 5], { maxIter: 100, tol: 1e-6 });
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-2, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 2) < 1e-2, `y=${r.x[1]}`);
});

test('opt-trust-region-dogleg numGrad 正确', () => {
  const g = numGrad(f, [0, 0]);
  // ∂f/∂x = 2(x-1) = -2; ∂f/∂y = 4(y-2) = -8
  assert.ok(Math.abs(g[0]! + 2) < 1e-4);
  assert.ok(Math.abs(g[1]! + 8) < 1e-4);
});

test('opt-trust-region-dogleg numHessian 对称', () => {
  const H = numHessian(f, [0, 0]);
  assert.ok(Math.abs(H[0]![1]! - H[1]![0]!) < 1e-6);
  // H = diag(2, 4)
  assert.ok(Math.abs(H[0]![0]! - 2) < 1e-2);
  assert.ok(Math.abs(H[1]![1]! - 4) < 1e-2);
});

test('opt-trust-region-dogleg doglegStep 小半径返回截断', () => {
  // g=[-2,-8], B=diag(2,4) 正定
  const g: Vec = [-2, -8];
  const B = [
    [2, 0],
    [0, 4],
  ];
  const { p, type } = doglegStep(g, B, 0.01);
  // 小半径：步范数应等于半径
  assert.ok(Math.abs(Math.hypot(p[0]!, p[1]!) - 0.01) < 1e-6);
  assert.ok(type.includes('cauchy') || type === 'dogleg');
});

test('opt-trust-region-dogleg doglegStep 大半径返回牛顿点', () => {
  const g: Vec = [-2, -8];
  const B = [
    [2, 0],
    [0, 4],
  ];
  const { p, type } = doglegStep(g, B, 1000);
  assert.equal(type, 'newton');
  // 牛顿点 = -B⁻¹g = (1, 2)
  assert.ok(Math.abs(p[0]! - 1) < 1e-6);
  assert.ok(Math.abs(p[1]! - 2) < 1e-6);
});

test('opt-trust-region-dogleg 收敛标志', () => {
  const r = trustRegionDogleg(f, [5, 5], { maxIter: 100, tol: 1e-6 });
  assert.equal(r.converged, true);
});

test('opt-trust-region-dogleg 钩子', () => {
  let iters = 0;
  let results = 0;
  const hooks: DoglegHooks = {
    onIter: () => iters++,
    onResult: () => results++,
  };
  trustRegionDogleg(f, [5, 5], { maxIter: 5, tol: 1e-14 }, hooks);
  assert.ok(iters >= 1);
  assert.equal(results, 1);
});

test('opt-trust-region-dogleg 非凸目标也能下降', () => {
  // Rosenbrock
  const fR = (x: Vec): number => (1 - x[0]!) ** 2 + 100 * (x[1]! - x[0]! ** 2) ** 2;
  const r = trustRegionDogleg(fR, [-1.2, 1], { maxIter: 200, tol: 1e-4 });
  assert.ok(Math.abs(r.x[0]! - 1) < 1e-1, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1) < 1e-1, `y=${r.x[1]}`);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
});
