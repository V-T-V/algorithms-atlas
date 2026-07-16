import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clenshawCurtis,
  integrateCc,
} from '../../src/algorithms/numerical/num-clenshaw-curtis/impl.ts';

test('CC 权重求和等于区间长度', () => {
  const { weights } = clenshawCurtis(8, 0, 2);
  const s = weights.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(s - 2) < 1e-9);
});

test('CC 积分 sin(x) 在 [0,π] = 2', () => {
  const r = integrateCc((x) => Math.sin(x), 0, Math.PI, 16);
  assert.ok(Math.abs(r - 2) < 1e-10);
});

test('CC 积分常数 = 区间长度', () => {
  const r = integrateCc((_x) => 5, 1, 4, 8);
  assert.ok(Math.abs(r - 15) < 1e-9);
});

test('CC 积分多项式精确', () => {
  // ∫_0^1 x³ dx = 1/4
  const r = integrateCc((x) => x * x * x, 0, 1, 8);
  assert.ok(Math.abs(r - 0.25) < 1e-9);
});

test('CC N < 1 抛错', () => {
  assert.throws(() => clenshawCurtis(0), RangeError);
});

test('CC 谱收敛：N 越大越精确', () => {
  // ∫_{-1}^{1} e^x dx = e - 1/e
  const exact = Math.E - 1 / Math.E;
  const r4 = integrateCc((x) => Math.exp(x), -1, 1, 4);
  const r16 = integrateCc((x) => Math.exp(x), -1, 1, 16);
  assert.ok(Math.abs(r16 - exact) < Math.abs(r4 - exact));
});
