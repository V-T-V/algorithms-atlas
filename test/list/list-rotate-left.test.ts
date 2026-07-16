import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  rotateLeft,
} from '../../src/algorithms/list/list-rotate-left/impl.ts';

test('rotateLeft 左旋', () => {
  assert.deepEqual(listToArray(rotateLeft(buildList([1, 2, 3, 4, 5]), 2)), [3, 4, 5, 1, 2]);
  assert.deepEqual(listToArray(rotateLeft(buildList([1, 2, 3]), 0)), [1, 2, 3]);
  assert.deepEqual(listToArray(rotateLeft(buildList([1, 2, 3]), 3)), [1, 2, 3]);
  assert.deepEqual(listToArray(rotateLeft(buildList([1, 2, 3]), 5)), [3, 1, 2]);
  assert.deepEqual(listToArray(rotateLeft(buildList([1]), 10)), [1]);
  assert.deepEqual(listToArray(rotateLeft(buildList([]), 3)), []);
});

test('rotateLeft 钩子', () => {
  let newHead = -1;
  rotateLeft(buildList([1, 2, 3, 4, 5]), 2, {
    onNewHead: (v) => {
      newHead = v;
    },
  });
  assert.equal(newHead, 3);
});
