import { test } from 'node:test';
import assert from 'node:assert/strict';
import { max1Max2 } from '../../src/algorithms/selection/sel-max1-max2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-max1-max2/trace.ts';

test('sel-max1-max2 基本', () => {
  const r = max1Max2([7, 3, 9, 1, 8, 2]);
  assert.equal(r.max1, 9);
  assert.equal(r.max2, 8);
});

test('sel-max1-max2 首元素最大', () => {
  const r = max1Max2([9, 5, 3, 1]);
  assert.equal(r.max1, 9);
  assert.equal(r.max2, 5);
});

test('sel-max1-max2 全相同抛错', () => {
  assert.throws(() => max1Max2([5, 5, 5]));
});

test('sel-max1-max2 少于 2 个抛错', () => {
  assert.throws(() => max1Max2([1]));
});

test('sel-max1-max2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
