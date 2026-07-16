import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lp1dMax } from '../../src/algorithms/randomized/rand-las-vegas-linear/impl.ts';
test('可行', () => {
  // x≤3, x≥-2 (即 -x≤2), max x: x=3
  assert.ok(Math.abs((lp1dMax([1, -1], [3, 2], 1) ?? NaN) - 3) < 1e-9);
});
test('不可行', () => {
  // x≤1, x≥5 不可行
  assert.equal(lp1dMax([1, -1], [1, -5], 1), null);
});
