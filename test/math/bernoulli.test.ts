import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bernoulli } from '../../src/algorithms/math/bernoulli/impl.ts';

test('bernoulli 前 7 项（分数精确）', () => {
  const B = bernoulli(6);
  // B0=1/1, B1=-1/2, B2=1/6, B3=0/1, B4=-1/30, B5=0/1, B6=1/42
  assert.deepEqual(B[0], [1, 1]);
  assert.deepEqual(B[1], [-1, 2]);
  assert.deepEqual(B[2], [1, 6]);
  assert.deepEqual(B[3], [0, 1]);
  assert.deepEqual(B[4], [-1, 30]);
  assert.deepEqual(B[5], [0, 1]);
  assert.deepEqual(B[6], [1, 42]);
});

test('bernoulli B8 = -1/30', () => {
  const B = bernoulli(8);
  assert.deepEqual(B[8], [-1, 30]);
});

test('bernoulli 奇数下标 > 1 全为 0', () => {
  const B = bernoulli(11);
  assert.deepEqual(B[3], [0, 1]);
  assert.deepEqual(B[5], [0, 1]);
  assert.deepEqual(B[7], [0, 1]);
  assert.deepEqual(B[9], [0, 1]);
  assert.deepEqual(B[11], [0, 1]);
});

test('bernoulli 边界', () => {
  assert.deepEqual(bernoulli(0), [[1, 1]]);
  assert.throws(() => bernoulli(-1), RangeError);
});

test('bernoulli 钩子被调用', () => {
  let count = 0;
  bernoulli(5, { onComputed: () => count++ });
  assert.equal(count, 6, '应计算 B0..B5 共 6 项');
});
