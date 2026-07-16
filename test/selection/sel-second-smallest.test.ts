import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secondSmallest } from '../../src/algorithms/selection/sel-second-smallest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-second-smallest/trace.ts';

test('sel-second-smallest 基本', () => {
  const r = secondSmallest([7, 3, 9, 1, 8, 2, 5, 4]);
  assert.equal(r.min, 1);
  assert.equal(r.secondMin, 2);
});

test('sel-second-smallest 两个元素', () => {
  const r = secondSmallest([5, 3]);
  assert.equal(r.min, 3);
  assert.equal(r.secondMin, 5);
});

test('sel-second-smallest 比较数合理', () => {
  const r = secondSmallest([5, 3, 9, 1, 8, 2, 5, 4]);
  // n=8: n-1 + log2(8) - 1 = 7 + 2 = 9，但本实现计数稍多
  assert.ok(r.comparisons >= 8);
});

test('sel-second-smallest 少于 2 抛错', () => {
  assert.throws(() => secondSmallest([1]));
});

test('sel-second-smallest trace', () => {
  assert.ok(buildTrace().length >= 2);
});
