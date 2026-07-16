import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  combinationsBitmask,
  combinationsBitmaskIter,
} from '../../src/algorithms/recursion/rec-combinations-bitmask/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-combinations-bitmask/trace.ts';

test('rec-combinations-bitmask 数量正确', () => {
  assert.equal(combinationsBitmask([1, 2, 3, 4], 2).length, 6);
  assert.equal(combinationsBitmask([1, 2, 3, 4, 5], 3).length, 10);
});

test('rec-combinations-bitmask 边界 k=0 和 k=n', () => {
  assert.deepEqual(combinationsBitmask([1, 2, 3], 0), [[]]);
  assert.deepEqual(combinationsBitmask([1, 2, 3], 3), [[1, 2, 3]]);
});

test('rec-combinations-bitmask 递归与位掩码一致', () => {
  const a = combinationsBitmask([1, 2, 3, 4], 2)
    .map((c) => c.join(','))
    .sort();
  const b = combinationsBitmaskIter([1, 2, 3, 4], 2)
    .map((c) => c.join(','))
    .sort();
  assert.deepEqual(a, b);
});

test('rec-combinations-bitmask trace', () => {
  assert.ok(buildTrace().length > 2);
});
