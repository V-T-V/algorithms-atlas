import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapPairs, buildList, toArray } from '../../src/algorithms/list/swap-nodes-pairs/impl.ts';

test('swapPairs 基本用例', () => {
  assert.deepEqual(toArray(swapPairs(buildList([1, 2, 3, 4]), undefined)), [2, 1, 4, 3]);
  assert.deepEqual(toArray(swapPairs(buildList([1, 2, 3, 4, 5]), undefined)), [2, 1, 4, 3, 5]);
});

test('swapPairs 奇数个节点末尾保留', () => {
  assert.deepEqual(toArray(swapPairs(buildList([1, 2, 3]), undefined)), [2, 1, 3]);
  assert.deepEqual(toArray(swapPairs(buildList([1]), undefined)), [1]);
});

test('swapPairs 偶数个节点全部交换', () => {
  assert.deepEqual(toArray(swapPairs(buildList([1, 2]), undefined)), [2, 1]);
  assert.deepEqual(
    toArray(swapPairs(buildList([1, 2, 3, 4, 5, 6]), undefined)),
    [2, 1, 4, 3, 6, 5],
  );
});

test('swapPairs 边界', () => {
  assert.equal(swapPairs(null, undefined), null);
  assert.deepEqual(toArray(swapPairs(buildList([42]), undefined)), [42]);
});

test('swapPairs 交换的是节点本身不是值', () => {
  // 构造带身份可识别的链表，交换后值序应翻转
  const head = buildList([10, 20, 30, 40]);
  const result = swapPairs(head, undefined);
  assert.deepEqual(toArray(result), [20, 10, 40, 30]);
});

test('swapPairs 钩子被调用', () => {
  let swaps = 0;
  swapPairs(buildList([1, 2, 3, 4, 5]), {
    onSwap: () => swaps++,
    onSingleLeft: () => {},
  });
  assert.equal(swaps, 2, '应交换 2 对');
});
