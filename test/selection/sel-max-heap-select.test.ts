import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxHeapSelect } from '../../src/algorithms/selection/sel-max-heap-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-max-heap-select/trace.ts';

test('max-heap select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(maxHeapSelect(a, k), k);
});
test('max-heap select 最大值', () => assert.equal(maxHeapSelect([5, 1, 3, 9, 2], 4), 9));
test('max-heap select trace 非空', () => assert.ok(buildTrace().length > 0));
