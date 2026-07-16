import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  removeElements,
} from '../../src/algorithms/list/list-remove-elements/impl.ts';

test('removeElements 删除', () => {
  assert.deepEqual(
    listToArray(removeElements(buildList([1, 2, 6, 3, 4, 5, 6]), 6)),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(listToArray(removeElements(buildList([7, 7, 7]), 7)), []);
  assert.deepEqual(listToArray(removeElements(buildList([1, 2, 3]), 4)), [1, 2, 3]);
  assert.deepEqual(listToArray(removeElements(buildList([1]), 1)), []);
});

test('removeElements 钩子', () => {
  let count = 0;
  removeElements(buildList([6, 1, 6]), 6, { onRemove: () => count++ });
  assert.equal(count, 2);
});
