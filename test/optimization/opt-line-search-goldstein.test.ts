import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goldsteinLineSearch } from '../../src/algorithms/optimization/opt-line-search-goldstein/impl.ts';

const f = (x: number[]): number => (x[0]! - 3) ** 2 + (x[1]! - 1) ** 2;
const grad = (x: number[]): number[] => [2 * (x[0]! - 3), 2 * (x[1]! - 1)];

test('goldstein: 沿 p=(1,0) 找到落入区间的步长', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const r = goldsteinLineSearch(f, x0, fx, gx, p, { c: 0.1 });
  assert.equal(r.accepted, true);
  // 沿 p=(1,0) 最优 α=3；Goldstein 区间大约 [1.5, 4.5]（c=0.1）
  assert.ok(r.alpha > 0.5 && r.alpha < 5, `alpha=${r.alpha}`);
  assert.ok(r.fnew < fx, 'must decrease');
});

test('goldstein: 接受的步长满足上界（Armijo）', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const c = 0.2;
  const dphi0 = gx[0]! * p[0]! + gx[1]! * p[1]!;
  const r = goldsteinLineSearch(f, x0, fx, gx, p, { c });
  assert.ok(r.fnew <= fx + c * r.alpha * dphi0 + 1e-9, 'upper bound violated');
});

test('goldstein: 接受的步长满足下界', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const c = 0.1;
  const dphi0 = gx[0]! * p[0]! + gx[1]! * p[1]!;
  const r = goldsteinLineSearch(f, x0, fx, gx, p, { c });
  assert.ok(r.fnew >= fx + (1 - c) * r.alpha * dphi0 - 1e-9, 'lower bound violated');
});

test('goldstein: 二次函数沿最优方向逼近 α=3', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const r = goldsteinLineSearch(f, x0, fx, gx, p, { c: 0.2, alpha0: 2 });
  // 区间中心接近 α=3
  assert.ok(Math.abs(r.alpha - 3) < 1.5, `alpha=${r.alpha}`);
});
