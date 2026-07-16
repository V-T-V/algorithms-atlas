import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  partitionList,
} from '../../src/algorithms/list/partition-list/impl.ts';

test('partitionList 分隔', () => {
  assert.deepEqual(
    listToArray(partitionList(buildList([1, 4, 3, 2, 5, 2]), 3)),
    [1, 2, 2, 4, 3, 5],
  );
  assert.deepEqual(listToArray(partitionList(buildList([2, 1]), 2)), [1, 2]);
  assert.deepEqual(listToArray(partitionList(buildList([]), 1)), []);
  assert.deepEqual(listToArray(partitionList(buildList([1]), 2)), [1]);
});

test('partitionList 钩子', () => {
  let classify = 0;
  partitionList(buildList([1, 4, 3, 2, 5, 2]), 3, { onClassify: () => classify++ });
  assert.equal(classify, 6);
});
