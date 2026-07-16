import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChebInterp,
  evalCheb,
  chebInterp,
} from '../../src/algorithms/numerical/num-chebyshev-interp/impl.ts';

test('切比雪夫插值精确通过节点', () => {
  const f = (x: number): number => Math.exp(x);
  const interp = buildChebInterp(f, 5);
  for (const x of interp.nodes) {
    assert.ok(Math.abs(evalCheb(interp, x) - f(x)) < 1e-9);
  }
});

test('切比雪夫插值多项式精确', () => {
  // n=5 可精确插值 5 次多项式
  const f = (x: number): number => x * x * x;
  assert.ok(Math.abs(chebInterp(f, 0.7, 5) - 0.7 * 0.7 * 0.7) < 1e-9);
});

test('切比雪夫插值指数函数高精度', () => {
  const f = (x: number): number => Math.exp(x);
  const p = chebInterp(f, 0.5, 10);
  assert.ok(Math.abs(p - Math.exp(0.5)) < 1e-9);
});

test('无龙格现象（高次稳定）', () => {
  // Runge 函数：等距插值会发散，切比雪夫插值稳定
  const f = (x: number): number => 1 / (1 + 25 * x * x);
  const p = chebInterp(f, 0.9, 20);
  assert.ok(Math.abs(p - f(0.9)) < 1e-6);
});

test('n < 1 抛错', () => {
  assert.throws(() => buildChebInterp((_x) => 0, 0), RangeError);
});
