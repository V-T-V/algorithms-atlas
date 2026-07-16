import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reverseKGroup,
  buildList,
  toArray,
} from '../../src/algorithms/list/reverse-nodes-kgroup/impl.ts';

test('reverseKGroup 基本用例', () => {
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2)), [2, 1, 4, 3, 5]);
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 3)), [3, 2, 1, 4, 5]);
});

test('reverseKGroup k=1 不反转', () => {
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2, 3]), 1)), [1, 2, 3]);
});

test('reverseKGroup 恰好整除', () => {
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2, 3, 4]), 2)), [2, 1, 4, 3]);
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2, 3, 4, 5, 6]), 3)), [3, 2, 1, 6, 5, 4]);
});

test('reverseKGroup k 大于链表长度不反转', () => {
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2, 3]), 5)), [1, 2, 3]);
});

test('reverseKGroup 边界', () => {
  assert.equal(reverseKGroup(null, 2), null);
  assert.deepEqual(toArray(reverseKGroup(buildList([1]), 2)), [1]);
  assert.deepEqual(toArray(reverseKGroup(buildList([1, 2]), 2)), [2, 1]);
});

test('reverseKGroup 不影响逻辑独立性（结构正确）', () => {
  // 验证反转后链表无环、节点数正确
  const head = reverseKGroup(buildList([1, 2, 3, 4, 5, 6]), 3);
  assert.equal(toArray(head).length, 6);
});

test('reverseKGroup 钩子被调用', () => {
  let groups = 0;
  let short = 0;
  reverseKGroup(buildList([1, 2, 3, 4, 5]), 2, {
    onGroupReversed: () => groups++,
    onShortTail: () => short++,
  });
  assert.equal(groups, 2, '应反转 2 段');
  assert.equal(short, 1, '应剩 1 个不足');
});
