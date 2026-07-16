import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mad } from '../../src/algorithms/selection/sel-mad/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-mad/trace.ts';

test('mad 1..5 = 1', () => {
  // median=3, devs=[2,1,0,1,2] → median=1
  assert.equal(mad([1, 2, 3, 4, 5]), 1);
});
test('mad 对 100 稳健', () => {
  const m = mad([1, 2, 3, 4, 5, 6, 7, 8, 100]);
  assert.ok(m < 10); // 不被 100 拉偏
});
test('mad trace 非空', () => assert.ok(buildTrace().length > 0));
