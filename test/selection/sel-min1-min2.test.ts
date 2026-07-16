import { test } from 'node:test';
import assert from 'node:assert/strict';
import { min1Min2 } from '../../src/algorithms/selection/sel-min1-min2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-min1-min2/trace.ts';

test('sel-min1-min2 基本', () => {
  const r = min1Min2([7, 3, 9, 1, 8, 2]);
  assert.equal(r.min1, 1);
  assert.equal(r.min2, 2);
});

test('sel-min1-min2 首元素最小', () => {
  const r = min1Min2([1, 5, 3, 9]);
  assert.equal(r.min1, 1);
  assert.equal(r.min2, 3);
});

test('sel-min1-min2 全相同抛错', () => {
  assert.throws(() => min1Min2([5, 5, 5]));
});

test('sel-min1-min2 少于 2 个抛错', () => {
  assert.throws(() => min1Min2([1]));
});

test('sel-min1-min2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
