import { test } from 'node:test';
import assert from 'node:assert/strict';
import { augmentedLagrangian } from '../../src/algorithms/optimization/opt-augmented-lagrangian/impl.ts';

// min (x-3)^2 + (y-2)^2  s.t. x+y=4 → 最优 (2.5, 1.5)，λ=-1
const f = (x: number[]): number => (x[0]! - 3) ** 2 + (x[1]! - 2) ** 2;
const gradf = (x: number[]): number[] => [2 * (x[0]! - 3), 2 * (x[1]! - 2)];
const H = [(x: number[]): number => x[0]! + x[1]! - 4];
const gradH = [(): number[] => [1, 1]];

test('AL: 收敛到 (2.5, 1.5) 附近', () => {
  const r = augmentedLagrangian(f, gradf, H, gradH, [0, 0], {
    mu0: 10,
    beta: 5,
    eps: 1e-7,
    innerLr: 0.02,
  });
  assert.ok(Math.abs(r.x[0]! - 2.5) < 0.1, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1.5) < 0.1, `y=${r.x[1]}`);
});

test('AL: 等式约束满足（违反量很小）', () => {
  const r = augmentedLagrangian(f, gradf, H, gradH, [0, 0], {
    mu0: 10,
    beta: 5,
    eps: 1e-7,
    innerLr: 0.02,
  });
  assert.ok(r.violation < 1e-2, `violation=${r.violation}`);
});

test('AL: 乘子 λ 逼近最优 λ=-1', () => {
  const r = augmentedLagrangian(f, gradf, H, gradH, [0, 0], {
    mu0: 10,
    beta: 5,
    eps: 1e-7,
    innerLr: 0.02,
  });
  // KKT: 2(x-3)=λ → x=2.5 时 λ=-1
  assert.ok(Math.abs(r.lambda[0]! - -1) < 0.2, `lambda=${r.lambda[0]}`);
});

test('AL: 不像纯罚函数那样 μ→∞', () => {
  const r = augmentedLagrangian(f, gradf, H, gradH, [0, 0], {
    mu0: 10,
    beta: 5,
    eps: 1e-7,
    innerLr: 0.02,
  });
  // μ 应远小于 1e6（不像纯罚函数那样爆炸）
  assert.ok(r.muFinal < 1e5, `mu=${r.muFinal}`);
});
