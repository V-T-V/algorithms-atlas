import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quickselect,
  type QuickselectHooks,
} from '../../src/algorithms/searching/search-quickselect/impl.ts';

test('quickselect 基本', () => {
  assert.equal(quickselect([7, 10, 4, 3, 20, 15], 3), 7);
  assert.equal(quickselect([7, 10, 4, 3, 20, 15], 1), 3);
  assert.equal(quickselect([7, 10, 4, 3, 20, 15], 6), 20);
});
test('quickselect 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselect(input, 2);
  assert.deepEqual(input, [3, 1, 2]);
});
test('quickselect 边界', () => {
  assert.equal(quickselect([5], 1), 5);
  assert.throws(() => quickselect([1, 2], 3));
});
test('quickselect 钩子', () => {
  let c = 0;
  quickselect([7, 10, 4], 2, { onPartition: () => c++ } as QuickselectHooks);
  assert.ok(c >= 1);
});
