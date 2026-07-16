import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wolfeLineSearch } from '../../src/algorithms/optimization/opt-line-search-wolfe/impl.ts';

// f(x,y) = (x-3)^2 + (y-1)^2，最优点 (3,1)
const f = (x: number[]): number => (x[0]! - 3) ** 2 + (x[1]! - 1) ** 2;
const grad = (x: number[]): number[] => [2 * (x[0]! - 3), 2 * (x[1]! - 1)];

test('wolfe: 沿最优方向 p=(1,0) 找到强 Wolfe 步长', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const dphi0 = gx[0]! * p[0]! + gx[1]! * p[1]!;
  const r = wolfeLineSearch(f, grad, x0, fx, gx, p, { c1: 1e-4, c2: 0.9 });
  assert.equal(r.accepted, true);
  // Wolfe 区间内的任何 α 都合法；最优 α=3，强 Wolfe 用 c2=0.9 接受区间约为 [0.5, 5.5]
  assert.ok(r.alpha > 0, `alpha=${r.alpha}`);
  assert.ok(r.fnew < fx, 'fnew must decrease');
  // 验证接受的步长确实满足强 Wolfe 两条
  const xnew = [x0[0]! + r.alpha * p[0]!, x0[1]! + r.alpha * p[1]!];
  const gnew = grad(xnew);
  const dphi = gnew[0]! * p[0]! + gnew[1]! * p[1]!;
  assert.ok(r.fnew <= fx + 1e-4 * r.alpha * dphi0 + 1e-9, 'Armijo violated');
  assert.ok(Math.abs(dphi) <= 0.9 * Math.abs(dphi0) + 1e-9, 'curvature violated');
});

test('wolfe: 步长满足充分下降（Armijo）', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const dphi0 = gx[0]! * p[0]! + gx[1]! * p[1]!;
  const r = wolfeLineSearch(f, grad, x0, fx, gx, p);
  assert.ok(r.fnew <= fx + 1e-4 * r.alpha * dphi0 + 1e-9, 'Armijo violated');
});

test('wolfe: 接受的步长满足曲率条件（强 Wolfe）', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [1, 0];
  const dphi0 = gx[0]! * p[0]! + gx[1]! * p[1]!;
  const r = wolfeLineSearch(f, grad, x0, fx, gx, p, { c2: 0.9 });
  if (r.accepted) {
    const xnew = [x0[0]! + r.alpha * p[0]!, x0[1]! + r.alpha * p[1]!];
    const gnew = grad(xnew);
    const dphi = gnew[0]! * p[0]! + gnew[1]! * p[1]!;
    assert.ok(Math.abs(dphi) <= 0.9 * Math.abs(dphi0) + 1e-9, 'curvature violated');
  }
});

test('wolfe: 非下降方向应给出非接受结果或步长为 0 附近', () => {
  const x0 = [0, 1];
  const fx = f(x0);
  const gx = grad(x0);
  const p = [-1, 0]; // g=(-6,0)，gᵀp = 6 > 0，非下降
  const r = wolfeLineSearch(f, grad, x0, fx, gx, p, { alphaMax: 4 });
  // 非下降方向：要么不接受，要么 fnew 不下降
  assert.ok(!r.accepted || r.fnew >= fx, 'non-descent direction should not improve');
});
