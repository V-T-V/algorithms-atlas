import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decimalToCf, sqrtPeriodicCf } from '../../src/algorithms/math/fraction-continued/impl.ts';

test('decimalToCf 有理小数', () => {
  // 3.245 = 3 + 1/(4 + 1/(12 + ...))
  // 3.245 → [3; 4, 12, 5]（近似）
  const cf = decimalToCf(3.245, 20);
  assert.equal(cf[0], 3);
  assert.equal(cf[1], 4);
});

test('decimalToCf 整数', () => {
  assert.deepEqual(decimalToCf(7), [7]);
  assert.deepEqual(decimalToCf(0), [0]);
});

test('decimalToCf 黄金比附近', () => {
  // φ ≈ 1.618 → [1; 1, 1, 1, ...]
  const cf = decimalToCf(1.6180339887, 10);
  for (let i = 0; i < 5; i++) assert.equal(cf[i], 1);
});

test('sqrtPeriodicCf √2 周期 [2]', () => {
  const { prefix, period } = sqrtPeriodicCf(2);
  assert.deepEqual(prefix, [1n]);
  assert.deepEqual(period, [2n]);
});

test('sqrtPeriodicCf √13 周期', () => {
  // √13 = [3; overline{1,1,1,1,6}]
  const { prefix, period } = sqrtPeriodicCf(13);
  assert.deepEqual(prefix, [3n]);
  assert.deepEqual(period, [1n, 1n, 1n, 1n, 6n]);
});

test('sqrtPeriodicCf 完全平方无周期', () => {
  const { prefix, period } = sqrtPeriodicCf(9);
  assert.deepEqual(prefix, [3n]);
  assert.deepEqual(period, []);
});

test('sqrtPeriodicCf √3', () => {
  // √3 = [1; overline{1,2}]
  const { prefix, period } = sqrtPeriodicCf(3);
  assert.deepEqual(prefix, [1n]);
  assert.deepEqual(period, [1n, 2n]);
});
