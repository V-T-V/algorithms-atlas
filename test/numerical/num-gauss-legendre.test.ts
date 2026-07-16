import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gaussLegendre,
  integrateGl,
} from '../../src/algorithms/numerical/num-gauss-legendre/impl.ts';

test('GL 权重和 = 2（在 [-1,1]）', () => {
  const { weights } = gaussLegendre(5);
  const s = weights.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(s - 2) < 1e-9);
});

test('GL n 节点对 2n-1 次多项式精确', () => {
  // n=5：精确到 9 次。∫_0^1 x^9 dx = 0.1
  const r = integrateGl((x) => Math.pow(x, 9), 0, 1, 5);
  assert.ok(Math.abs(r - 0.1) < 1e-9);
});

test('GL 常数积分 = 区间长度', () => {
  const r = integrateGl((_x) => 7, 1, 4, 3);
  assert.ok(Math.abs(r - 21) < 1e-9);
});

test('GL 三角函数积分', () => {
  // ∫_0^π sin(x) dx = 2
  const r = integrateGl((x) => Math.sin(x), 0, Math.PI, 10);
  assert.ok(Math.abs(r - 2) < 1e-10);
});

test('GL n=1 特例', () => {
  const { nodes, weights } = gaussLegendre(1);
  assert.ok(Math.abs(nodes[0]!) < 1e-9);
  assert.ok(Math.abs(weights[0]! - 2) < 1e-9);
});

test('GL n < 1 抛错', () => {
  assert.throws(() => gaussLegendre(0), RangeError);
});
