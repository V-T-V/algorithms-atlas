import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  intersection,
} from '../../src/algorithms/list/intersection/impl.ts';

test('intersection 升序交集', () => {
  assert.deepEqual(
    listToArray(intersection(buildList([1, 4, 5]), buildList([3, 4, 5, 6, 7]))),
    [4, 5],
  );
  assert.deepEqual(
    listToArray(intersection(buildList([1, 2, 2, 3]), buildList([2, 2, 3, 4]))),
    [2, 3],
  );
  assert.deepEqual(listToArray(intersection(buildList([1, 2]), buildList([3, 4]))), []);
  assert.deepEqual(listToArray(intersection(buildList([]), buildList([1]))), []);
});

test('intersection 钩子', () => {
  let compares = 0;
  intersection(buildList([1, 2]), buildList([2, 3]), { onCompare: () => compares++ });
  assert.ok(compares > 0);
});
