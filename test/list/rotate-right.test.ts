import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  rotateRight,
} from '../../src/algorithms/list/rotate-right/impl.ts';

test('rotateRight 旋转', () => {
  assert.deepEqual(listToArray(rotateRight(buildList([1, 2, 3, 4, 5]), 2)), [4, 5, 1, 2, 3]);
  assert.deepEqual(listToArray(rotateRight(buildList([0, 1, 2]), 4)), [2, 0, 1]); // k 超长取模
  assert.deepEqual(listToArray(rotateRight(buildList([1, 2, 3, 4, 5]), 0)), [1, 2, 3, 4, 5]);
  assert.deepEqual(listToArray(rotateRight(buildList([1, 2]), 1)), [2, 1]);
  assert.deepEqual(listToArray(rotateRight(buildList([]), 3)), []);
});

test('rotateRight 钩子', () => {
  let cut = false;
  rotateRight(buildList([1, 2, 3, 4, 5]), 2, { onCut: () => (cut = true) });
  assert.equal(cut, true);
});
