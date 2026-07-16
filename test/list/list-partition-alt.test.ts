import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  partitionAlt,
} from '../../src/algorithms/list/list-partition-alt/impl.ts';

test('partitionAlt 分隔', () => {
  assert.deepEqual(listToArray(partitionAlt(buildList([1, 4, 3, 2, 5, 2]), 3)), [1, 2, 2, 4, 3, 5]);
  assert.deepEqual(listToArray(partitionAlt(buildList([2, 1]), 2)), [1, 2]);
  assert.deepEqual(listToArray(partitionAlt(buildList([5, 4, 3]), 1)), [5, 4, 3]);
  assert.deepEqual(listToArray(partitionAlt(buildList([1, 2]), 9)), [1, 2]);
});

test('partitionAlt 保持相对顺序', () => {
  const out = listToArray(partitionAlt(buildList([3, 1, 2, 5, 4]), 3));
  // <3: [1,2] ; >=3: [3,5,4]
  assert.deepEqual(out, [1, 2, 3, 5, 4]);
});

test('partitionAlt 钩子', () => {
  const sides: string[] = [];
  partitionAlt(buildList([1, 4, 2]), 3, { onDispatch: (_v, s) => sides.push(s) });
  assert.deepEqual(sides, ['less', 'geq', 'less']);
});
