import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gaussHermite,
  integrateGh,
} from '../../src/algorithms/numerical/num-gauss-hermite/impl.ts';

test('GH 权重和 = √π（∫ e^{-x²} dx）', () => {
  const { weights } = gaussHermite(8);
  const s = weights.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(s - Math.sqrt(Math.PI)) < 1e-9);
});

test('GH 积分 x² e^{-x²} = √π/2', () => {
  const r = integrateGh((x) => x * x, 10);
  const exact = Math.sqrt(Math.PI) / 2;
  assert.ok(Math.abs(r - exact) < 1e-9);
});

test('GH 积分常数 = √π', () => {
  const r = integrateGh((_x) => 1, 6);
  assert.ok(Math.abs(r - Math.sqrt(Math.PI)) < 1e-9);
});

test('GH 积分 e^{2x} e^{-x²} = √π · e', () => {
  // ∫ e^{2x} e^{-x²} dx = e · ∫ e^{-(x-1)²} dx = e√π
  const r = integrateGh((x) => Math.exp(2 * x), 12);
  const exact = Math.E * Math.sqrt(Math.PI);
  assert.ok(Math.abs(r - exact) < 1e-6);
});

test('GH n=1 节点 = 0', () => {
  const { nodes } = gaussHermite(1);
  assert.ok(Math.abs(nodes[0]!) < 1e-9);
});

test('GH n < 1 抛错', () => {
  assert.throws(() => gaussHermite(0), RangeError);
});
