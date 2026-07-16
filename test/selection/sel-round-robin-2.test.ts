import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobinSelect } from '../../src/algorithms/selection/sel-round-robin-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-round-robin-2/trace.ts';

test('round-robin select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(roundRobinSelect(a, k), k);
});
test('round-robin select trace 非空', () => assert.ok(buildTrace().length > 0));
