import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectRandom } from '../../src/algorithms/selection/sel-quickselect-pivot-random/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-quickselect-pivot-random/trace.ts';

test('quickselect random 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(quickselectRandom(a, k, 7), k);
});
test('quickselect random 单元素', () => assert.equal(quickselectRandom([5], 0), 5));
test('quickselect random trace 非空', () => assert.ok(buildTrace().length > 0));
