import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeSortDc,
  flattenTree,
} from '../../src/algorithms/design/divide-conquer-design/impl.ts';

test('mergeSortDc 基本排序', () => {
  const { sorted } = mergeSortDc([5, 2, 8, 1, 9, 3, 7, 4, 6]);
  assert.deepEqual(sorted, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('mergeSortDc 空数组', () => {
  assert.deepEqual(mergeSortDc([]).sorted, []);
});

test('mergeSortDc 单元素', () => {
  assert.deepEqual(mergeSortDc([42]).sorted, [42]);
});

test('mergeSortDc 已排序', () => {
  assert.deepEqual(mergeSortDc([1, 2, 3, 4, 5]).sorted, [1, 2, 3, 4, 5]);
});

test('mergeSortDc 逆序', () => {
  assert.deepEqual(mergeSortDc([5, 4, 3, 2, 1]).sorted, [1, 2, 3, 4, 5]);
});

test('mergeSortDc 含重复', () => {
  assert.deepEqual(mergeSortDc([3, 1, 3, 1, 3]).sorted, [1, 1, 3, 3, 3]);
});

test('mergeSortDc 与内置 sort 一致', () => {
  const arr = [9, 4, 7, 2, 8, 1, 5, 6, 0, 3];
  assert.deepEqual(
    mergeSortDc(arr).sorted,
    [...arr].sort((a, b) => a - b),
  );
});

test('mergeSortDc 不修改原数组引用外内容（传入只读）', () => {
  const input = [3, 1, 2];
  const { sorted } = mergeSortDc(input);
  assert.deepEqual(sorted, [1, 2, 3]);
  // input 应保持原样（内部拷贝）
  assert.deepEqual(input, [3, 1, 2]);
});

test('mergeSortDc 递归树节点数正确', () => {
  const { tree } = mergeSortDc([3, 1, 4, 1]);
  const nodes = flattenTree(tree);
  // 4 个元素：根 + 2 个内节点 + 4 个叶 = 7
  assert.equal(nodes.length, 7);
});

test('mergeSortDc onDivide/onMerge 钩子', () => {
  let divides = 0;
  let merges = 0;
  mergeSortDc([2, 1, 3], {
    onDivide: () => divides++,
    onMerge: () => merges++,
  });
  // n=3：内部节点 = 根 [0,3) 与 [1,3) 两个 → divides=2；每次内部节点合并一次 → merges=2
  assert.equal(divides, 2);
  assert.equal(merges, 2);
});
