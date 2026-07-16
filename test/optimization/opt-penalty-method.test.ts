import { test } from 'node:test';
import assert from 'node:assert/strict';
import { penaltyMethod } from '../../src/algorithms/optimization/opt-penalty-method/impl.ts';

// min (x-4)^2 + (y-2)^2  s.t. x+y<=4, x>=0, y>=0 → 最优 (3,1)
const f = (x: number[]): number => (x[0]! - 4) ** 2 + (x[1]! - 2) ** 2;
const gradf = (x: number[]): number[] => [2 * (x[0]! - 4), 2 * (x[1]! - 2)];
const G = [
  (x: number[]): number => x[0]! + x[1]! - 4,
  (x: number[]): number => -x[0]!,
  (x: number[]): number => -x[1]!,
];
const gradG = [(): number[] => [1, 1], (): number[] => [-1, 0], (): number[] => [0, -1]];

test('penalty: 收敛到 (3,1) 附近', () => {
  const r = penaltyMethod(f, gradf, G, gradG, [0, 0], {
    mu0: 1,
    beta: 10,
    eps: 1e-6,
    innerLr: 0.02,
  });
  assert.ok(Math.abs(r.x[0]! - 3) < 0.3, `x=${r.x[0]}`);
  assert.ok(Math.abs(r.x[1]! - 1) < 0.3, `y=${r.x[1]}`);
});

test('penalty: 最终约束违反量很小', () => {
  const r = penaltyMethod(f, gradf, G, gradG, [0, 0], {
    mu0: 1,
    beta: 10,
    eps: 1e-6,
    innerLr: 0.02,
  });
  assert.ok(r.violation < 0.1, `violation=${r.violation}`);
});

test('penalty: μ 单调上升', () => {
  const mus: number[] = [];
  penaltyMethod(
    f,
    gradf,
    G,
    gradG,
    [0, 0],
    { mu0: 1, beta: 10, eps: 1e-6, innerLr: 0.02 },
    { onOuter: (mu) => mus.push(mu) },
  );
  for (let i = 1; i < mus.length; i++) {
    assert.ok(mus[i]! >= mus[i - 1]!, 'mu should not decrease');
  }
});

test('penalty: 不需要可行初值（从边界外开始）', () => {
  // 初值 (5,5) 严重违反 x+y<=4
  const r = penaltyMethod(f, gradf, G, gradG, [5, 5], {
    mu0: 10,
    beta: 10,
    eps: 1e-6,
    innerLr: 0.005,
  });
  assert.ok(Math.abs(r.x[0]! - 3) < 0.5, `x=${r.x[0]}`);
});
