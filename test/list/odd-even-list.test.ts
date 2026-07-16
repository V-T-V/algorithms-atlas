import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  oddEvenList,
} from '../../src/algorithms/list/odd-even-list/impl.ts';

test('oddEvenList 重排', () => {
  assert.deepEqual(listToArray(oddEvenList(buildList([1, 2, 3, 4, 5]))), [1, 3, 5, 2, 4]);
  assert.deepEqual(
    listToArray(oddEvenList(buildList([2, 1, 3, 5, 6, 4, 7]))),
    [2, 3, 6, 7, 1, 5, 4],
  );
  assert.deepEqual(listToArray(oddEvenList(buildList([1]))), [1]);
  assert.deepEqual(listToArray(oddEvenList(buildList([]))), []);
});

test('oddEvenList 钩子', () => {
  let visits = 0;
  oddEvenList(buildList([1, 2, 3, 4, 5]), { onVisit: () => visits++ });
  assert.ok(visits > 0);
});
