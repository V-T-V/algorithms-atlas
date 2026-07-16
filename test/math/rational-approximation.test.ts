import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rationalApprox } from '../../src/algorithms/math/rational-approximation/impl.ts';

test('rationalApprox π 的经典逼近 22/7', () => {
  const r = rationalApprox(Math.PI, 10);
  assert.equal(r.num, 22n);
  assert.equal(r.den, 7n);
});

test('rationalApprox π 分母 ≤ 100 → 311/99', () => {
  const r = rationalApprox(Math.PI, 100);
  // 311/99 = 3.141414...
  assert.equal(r.num, 311n);
  assert.equal(r.den, 99n);
});

test('rationalApprox 精确有理数', () => {
  const r = rationalApprox(0.5, 10);
  assert.equal(r.num / r.den <= 1n, true);
  assert.equal(Number(r.num) / Number(r.den), 0.5);
});

test('rationalApprox 黄金比', () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const r = rationalApprox(phi, 20);
  // 应为斐波那契比 34/21 但 21>20，取 13/8 或附近
  assert.ok(Number(r.num) / Number(r.den) > 1.6 && Number(r.num) / Number(r.den) < 1.62);
});

test('rationalApprox 整数', () => {
  const r = rationalApprox(3, 100);
  assert.equal(Number(r.num) / Number(r.den), 3);
});

test('rationalApprox 错误', () => {
  assert.throws(() => rationalApprox(1, 0), RangeError);
});
