import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minHeapSelect } from '../../src/algorithms/selection/sel-min-heap-select/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-min-heap-select/trace.ts';

test('min-heap select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(minHeapSelect(a, k), k);
});
test('min-heap select k=0', () => assert.equal(minHeapSelect([5, 1, 3], 0), 1));
test('min-heap select trace 非空', () => assert.ok(buildTrace().length > 0));
