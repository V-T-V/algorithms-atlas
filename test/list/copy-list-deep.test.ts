import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  copyListDeep,
  buildRandomList,
  randomListToArray,
  toArray,
} from '../../src/algorithms/list/copy-list-deep/impl.ts';

test('copyListDeep 完整拷贝 value + random', () => {
  const head = buildRandomList([7, 13, 11, 10, 1], [1, 4, 2, 0, -1]);
  const copy = copyListDeep(head);
  assert.deepEqual(randomListToArray(copy), [
    [7, 1],
    [13, 4],
    [11, 2],
    [10, 0],
    [1, -1],
  ]);
});

test('copyListDeep 副本是独立对象', () => {
  const head = buildRandomList([1, 2, 3], [-1, 0, 1]);
  const copy = copyListDeep(head);
  // 修改原链表不应影响副本
  if (head) head.value = 999;
  assert.deepEqual(toArray(copy), [1, 2, 3]);
});

test('copyListDeep 处理环（random 自指）', () => {
  const head = buildRandomList([1, 2], [0, 0]); // 第 0 个 random 自指
  const copy = copyListDeep(head);
  assert.deepEqual(randomListToArray(copy), [
    [1, 0],
    [2, 0],
  ]);
  // 副本的 random 应是副本自身，不是原节点
  let cur = copy;
  while (cur) {
    if (cur.value === 1) {
      assert.equal(cur.random, cur, '副本 random 应指向副本自身');
    }
    cur = cur.next;
  }
});

test('copyListDeep 空链表', () => {
  assert.equal(copyListDeep(null), null);
});

test('copyListDeep 单节点', () => {
  const head = buildRandomList([42], [-1]);
  const copy = copyListDeep(head);
  assert.deepEqual(randomListToArray(copy), [[42, -1]]);
});

test('copyListDeep 钩子被调用', () => {
  const head = buildRandomList([1, 2, 3], [-1, -1, -1]);
  let creates = 0;
  let randoms = 0;
  copyListDeep(head, {
    onCreate: () => creates++,
    onRandom: () => randoms++,
  });
  assert.equal(creates, 3, '应创建 3 个副本');
  assert.equal(randoms, 0, 'random 全为 null，不应触发 onRandom');
});
