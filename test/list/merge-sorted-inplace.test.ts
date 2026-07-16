import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeSortedInPlace,
  buildList,
  toArray,
} from '../../src/algorithms/list/merge-sorted-inplace/impl.ts';

test('mergeSortedInPlace 基本合并', () => {
  const r = mergeSortedInPlace(buildList([1, 3, 5, 7]), buildList([2, 4, 6, 8]));
  assert.deepEqual(toArray(r), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('mergeSortedInPlace 一条为空', () => {
  assert.deepEqual(toArray(mergeSortedInPlace(null, buildList([1, 2, 3]))), [1, 2, 3]);
  assert.deepEqual(toArray(mergeSortedInPlace(buildList([1, 2, 3]), null)), [1, 2, 3]);
  assert.equal(mergeSortedInPlace(null, null), null);
});

test('mergeSortedInPlace 重复元素保持稳定（l1 优先）', () => {
  const r = mergeSortedInPlace(buildList([1, 2, 2]), buildList([2, 3]));
  assert.deepEqual(toArray(r), [1, 2, 2, 2, 3]);
});

test('mergeSortedInPlace 完全交叉', () => {
  const r = mergeSortedInPlace(buildList([1, 3, 5]), buildList([2, 4, 6]));
  assert.deepEqual(toArray(r), [1, 2, 3, 4, 5, 6]);
});

test('mergeSortedInPlace 一长一短', () => {
  const r = mergeSortedInPlace(buildList([1]), buildList([2, 3, 4, 5, 6]));
  assert.deepEqual(toArray(r), [1, 2, 3, 4, 5, 6]);
});

test('mergeSortedInPlace 钩子被调用', () => {
  let compares = 0;
  let appends = 0;
  mergeSortedInPlace(buildList([1, 3]), buildList([2, 4]), {
    onCompare: () => compares++,
    onAppend: () => appends++,
  });
  assert.equal(compares, 3, '应比较 3 次（耗尽一条后直接拼接）');
  assert.equal(appends, 3, '应接入 3 次（拼接部分不计入 onAppend）');
});
