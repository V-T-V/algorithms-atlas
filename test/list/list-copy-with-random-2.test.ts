import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRandomList,
  copyWithRandom2,
  randomListToArray,
} from '../../src/algorithms/list/list-copy-with-random-2/impl.ts';

test('copyWithRandom2 深拷贝', () => {
  const head = buildRandomList([7, 13, 11, 10, 1], [null, 0, 4, 2, 0]);
  const copy = copyWithRandom2(head);
  const a = randomListToArray(head);
  const b = randomListToArray(copy);
  assert.deepEqual(a, b);
  // 拷贝应是独立对象
  assert.notEqual(head, copy);
});

test('copyWithRandom2 空链表', () => {
  assert.equal(copyWithRandom2(buildRandomList([], [])), null);
});

test('copyWithRandom2 单节点', () => {
  const copy = copyWithRandom2(buildRandomList([1], [0]));
  assert.equal(copy!.value, 1);
  assert.equal(copy!.random, copy);
});

test('copyWithRandom2 钩子', () => {
  let weaves = 0;
  copyWithRandom2(buildRandomList([1, 2], [null, 0]), { onWeave: () => weaves++ });
  assert.equal(weaves, 2);
});
