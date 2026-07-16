import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frog2 } from '../../src/algorithms/dp/dp-frog-2/impl.ts';

test('frog-2 AtCoder 例 1', () => {
  assert.equal(frog2([40, 10, 20, 70, 80, 10, 20, 70, 80, 0], 4), 20);
});

test('frog-2 K=2 三块', () => {
  assert.equal(frog2([10, 30, 40], 2), 30);
});

test('frog-2 K=1 累加高度差', () => {
  assert.equal(frog2([10, 20, 30, 40], 1), 30);
});

test('frog-2 两块', () => {
  assert.equal(frog2([10, 40], 5), 30);
});

test('frog-2 单块', () => {
  assert.equal(frog2([5], 3), 0);
});

test('frog-2 空', () => {
  assert.equal(frog2([], 3), 0);
});
