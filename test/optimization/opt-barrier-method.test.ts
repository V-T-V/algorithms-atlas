import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  barrierMethod,
  type Constraint,
} from '../../src/algorithms/optimization/opt-barrier-method/impl.ts';

// min (x-4)^2 + (y-2)^2  s.t. x+y<=4, x>=0, y>=0
// 无约束解 (4,2)；约束 x+y<=4 激活，最优在 (3,1) 附近（KKT: x-4=λ, y-2=λ, x+y=4 → x=3,y=1）
const f = (x: number[]): number => (x[0]! - 4) ** 2 + (x[1]! - 2) ** 2;
const grad = (x: number[]): number[] => [2 * (x[0]! - 4), 2 * (x[1]! - 2)];
const hess = (_x: number[]): number[][] => [
  [2, 0],
  [0, 2],
];
const con: Constraint = {
  A: [
    [1, 1],
    [-1, 0],
    [0, -1],
  ],
  b: [4, 0, 0],
};

test('barrier: 在约束 x+y<=4 激活时收敛到 (3,1) 附近', () => {
  const r = barrierMethod(f, grad, hess, con, [1, 0.5], { mu0: 1, tau: 0.2, eps: 1e-8 });
  assert.ok(r.converged, 'should converge');
  assert.ok(Math.abs(r.x[0]! - 3) < 0.1, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1) < 0.1, `y=${r.x[1]}`);
});

test('barrier: 最终解严格满足所有约束', () => {
  const r = barrierMethod(f, grad, hess, con, [1, 0.5], { mu0: 1, tau: 0.2, eps: 1e-8 });
  for (let i = 0; i < con.A.length; i++) {
    const ax = con.A[i]![0]! * r.x[0]! + con.A[i]![1]! * r.x[1]!;
    assert.ok(ax <= con.b[i]! + 1e-3, `constraint ${i} violated`);
  }
});

test('barrier: 非可行初值应抛错', () => {
  // x0 = (3, 3) 违反 x+y<=4
  assert.throws(() => barrierMethod(f, grad, hess, con, [3, 3], { mu0: 1 }));
});

test('barrier: μ 几何下降', () => {
  const mus: number[] = [];
  barrierMethod(
    f,
    grad,
    hess,
    con,
    [1, 0.5],
    { mu0: 1, tau: 0.2, eps: 1e-8 },
    { onOuter: (mu) => mus.push(mu) },
  );
  // μ 应单调下降
  for (let i = 1; i < mus.length; i++) {
    assert.ok(mus[i]! <= mus[i - 1]!, 'mu should decrease');
  }
});
