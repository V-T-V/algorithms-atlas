import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  rotateRight2,
} from '../../src/algorithms/list/list-rotate-right-2/impl.ts';

test('rotateRight2 右旋', () => {
  assert.deepEqual(listToArray(rotateRight2(buildList([1, 2, 3, 4, 5]), 2)), [4, 5, 1, 2, 3]);
  assert.deepEqual(listToArray(rotateRight2(buildList([1, 2, 3]), 0)), [1, 2, 3]);
  assert.deepEqual(listToArray(rotateRight2(buildList([1, 2, 3]), 3)), [1, 2, 3]);
  assert.deepEqual(listToArray(rotateRight2(buildList([1, 2, 3]), 5)), [2, 3, 1]);
  assert.deepEqual(listToArray(rotateRight2(buildList([1]), 10)), [1]);
  assert.deepEqual(listToArray(rotateRight2(buildList([]), 3)), []);
});

test('rotateRight2 钩子', () => {
  let closed = 0;
  let cutValue = -1;
  rotateRight2(buildList([1, 2, 3, 4, 5]), 2, {
    onCloseRing: () => closed++,
    onCut: (_h, c) => {
      cutValue = c;
    },
  });
  assert.equal(closed, 1);
  assert.equal(cutValue, 3);
});
