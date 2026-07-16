import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCircular,
  circularToArray,
  insertCircularSorted,
} from '../../src/algorithms/list/list-insert-circular-sorted/impl.ts';

test('insertCircularSorted 插入', () => {
  const head = insertCircularSorted(buildCircular([3, 4, 1]), 2);
  // 起点不变，从 head=3 开始一圈：3,4,1,2
  assert.deepEqual(circularToArray(head), [3, 4, 1, 2]);
});

test('insertCircularSorted 比所有都小', () => {
  const head = insertCircularSorted(buildCircular([3, 4, 1]), 0);
  assert.deepEqual(circularToArray(head), [3, 4, 0, 1]);
});

test('insertCircularSorted 空链表', () => {
  const head = insertCircularSorted(null, 5);
  assert.deepEqual(circularToArray(head), [5]);
});

test('insertCircularSorted 全相同', () => {
  const head = insertCircularSorted(buildCircular([3, 3, 3]), 3);
  assert.deepEqual(circularToArray(head), [3, 3, 3, 3]);
});

test('insertCircularSorted 钩子', () => {
  let inserted = false;
  insertCircularSorted(buildCircular([3, 4, 1]), 2, {
    onInsert: () => {
      inserted = true;
    },
  });
  assert.equal(inserted, true);
});
