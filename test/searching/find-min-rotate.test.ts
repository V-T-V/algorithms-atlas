import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findMinRotate,
  findMinRotateValue,
} from '../../src/algorithms/searching/find-min-rotate/impl.ts';

test('findMinRotate 基本', () => {
  assert.equal(findMinRotate([4, 5, 6, 7, 0, 1, 2]), 4);
  assert.equal(findMinRotate([3, 4, 5, 1, 2]), 3);
  assert.equal(findMinRotate([11, 13, 15, 17]), 0); // 未旋转
  assert.equal(findMinRotate([2, 1]), 1);
  assert.equal(findMinRotate([1]), 0);
  assert.equal(findMinRotate([]), -1);
});

test('findMinRotateValue', () => {
  assert.equal(findMinRotateValue([4, 5, 6, 7, 0, 1, 2]), 0);
  assert.equal(findMinRotateValue([3, 4, 5, 1, 2]), 1);
});

test('findMinRotate 钩子', () => {
  let done = -1;
  findMinRotate([4, 5, 6, 7, 0, 1, 2], { onDone: (i) => (done = i) });
  assert.equal(done, 4);
});
