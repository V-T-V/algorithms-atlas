import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  deleteMiddle,
} from '../../src/algorithms/list/list-delete-middle/impl.ts';

test('deleteMiddle 删除中点', () => {
  assert.deepEqual(listToArray(deleteMiddle(buildList([1, 2, 3, 4, 5]))), [1, 2, 4, 5]);
  assert.deepEqual(listToArray(deleteMiddle(buildList([1, 2, 3, 4]))), [1, 2, 4]);
  assert.deepEqual(listToArray(deleteMiddle(buildList([1, 2]))), [1]);
  assert.deepEqual(listToArray(deleteMiddle(buildList([1]))), []);
  assert.deepEqual(listToArray(deleteMiddle(buildList([]))), []);
});

test('deleteMiddle 钩子', () => {
  let found = -1;
  deleteMiddle(buildList([1, 2, 3, 4, 5]), {
    onFound: (v) => {
      found = v;
    },
  });
  assert.equal(found, 3);
});
