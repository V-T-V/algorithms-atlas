import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moDistinctCount } from '../../src/algorithms/ds/ds-mo-algorithm-offline/impl.ts';

test('Mo distinct count 基本', () => {
  const arr = [1, 2, 1, 3, 2, 4, 1, 5];
  const queries = [
    { l: 0, r: 4 }, // {1,2,3} = 3
    { l: 2, r: 6 }, // {1,3,2,4} = 4
    { l: 0, r: 7 }, // {1,2,3,4,5} = 5
  ];
  assert.deepEqual(moDistinctCount(arr, queries), [3, 4, 5]);
});

test('Mo distinct count 单元素区间', () => {
  const arr = [1, 2, 3, 4, 5];
  const queries = [
    { l: 0, r: 0 },
    { l: 4, r: 4 },
  ];
  assert.deepEqual(moDistinctCount(arr, queries), [1, 1]);
});

test('Mo distinct count 全相同', () => {
  const arr = [7, 7, 7, 7];
  const queries = [
    { l: 0, r: 3 },
    { l: 1, r: 2 },
  ];
  assert.deepEqual(moDistinctCount(arr, queries), [1, 1]);
});

test('Mo distinct count 全不同', () => {
  const arr = [1, 2, 3, 4, 5, 6];
  const queries = [{ l: 0, r: 5 }];
  assert.deepEqual(moDistinctCount(arr, queries), [6]);
});

test('Mo distinct count 与朴素对照', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  const naive = (l: number, r: number): number => new Set(arr.slice(l, r + 1)).size;
  const queries: Array<{ l: number; r: number }> = [];
  for (let l = 0; l < arr.length; l++) for (let r = l; r < arr.length; r++) queries.push({ l, r });
  const ans = moDistinctCount(arr, queries);
  for (let i = 0; i < queries.length; i++) {
    const { l, r } = queries[i]!;
    assert.equal(ans[i], naive(l, r), `${l}-${r}`);
  }
});

test('Mo 空查询', () => {
  assert.deepEqual(moDistinctCount([1, 2, 3], []), []);
});

test('Mo 含负数', () => {
  const arr = [-1, 2, -1, 3, 2];
  const queries = [{ l: 0, r: 4 }];
  assert.deepEqual(moDistinctCount(arr, queries), [3]); // {-1,2,3}
});
