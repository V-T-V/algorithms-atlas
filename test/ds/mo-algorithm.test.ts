import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  moAlgorithm,
  bruteDistinct,
  type MoHooks,
  type MoQuery,
} from '../../src/algorithms/ds/mo-algorithm/impl.ts';

test('moAlgorithm 区间不同元素个数（基本）', () => {
  const arr = [1, 2, 1, 3, 2, 4, 1, 5];
  const queries: MoQuery[] = [
    { l: 0, r: 4 },
    { l: 2, r: 5 },
    { l: 0, r: 7 },
    { l: 3, r: 4 },
  ];
  const out = moAlgorithm(arr, queries);
  assert.equal(out[0], 3); // {1,2,3}
  assert.equal(out[1], 4); // {1,3,2,4}
  assert.equal(out[2], 5); // {1,2,3,4,5}
  assert.equal(out[3], 2); // {3,2}
});

test('moAlgorithm 与暴力一致（随机）', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7];
  const queries: MoQuery[] = [];
  for (let i = 0; i < 30; i++) {
    const l = Math.floor((i * 7) % arr.length);
    const r = Math.floor((i * 13) % arr.length);
    queries.push({ l: Math.min(l, r), r: Math.max(l, r) });
  }
  const out = moAlgorithm(arr, queries);
  for (let i = 0; i < queries.length; i++) {
    const { l, r } = queries[i]!;
    assert.equal(out[i], bruteDistinct(arr, l, r), `mismatch q${i}=[${l},${r}]`);
  }
});

test('moAlgorithm 单点查询', () => {
  const arr = [5, 6, 7];
  const out = moAlgorithm(arr, [{ l: 1, r: 1 }]);
  assert.equal(out[0], 1);
});

test('moAlgorithm 全区间查询', () => {
  const arr = [1, 2, 3, 2, 1];
  const out = moAlgorithm(arr, [{ l: 0, r: 4 }]);
  assert.equal(out[0], 3); // {1,2,3}
});

test('moAlgorithm 空查询', () => {
  const arr = [1, 2, 3];
  assert.deepEqual(moAlgorithm(arr, []), []);
});

test('moAlgorithm 相同元素全相等', () => {
  const arr = [7, 7, 7, 7];
  const out = moAlgorithm(arr, [
    { l: 0, r: 3 },
    { l: 1, r: 2 },
  ]);
  assert.equal(out[0], 1);
  assert.equal(out[1], 1);
});

test('moAlgorithm 答案顺序与输入一致（不被排序打乱）', () => {
  const arr = [1, 2, 3, 1, 2];
  const queries: MoQuery[] = [
    { l: 0, r: 4 }, // 3
    { l: 0, r: 0 }, // 1
    { l: 2, r: 3 }, // 2
  ];
  const out = moAlgorithm(arr, queries);
  assert.deepEqual(out, [3, 1, 2]);
});

test('moAlgorithm 钩子被调用', () => {
  let moves = 0;
  let answers = 0;
  let sorted = false;
  const hooks: MoHooks = {
    onSort: () => {
      sorted = true;
    },
    onMove: () => moves++,
    onAnswer: () => answers++,
  };
  const arr = [1, 2, 1, 3];
  moAlgorithm(
    arr,
    [
      { l: 0, r: 3 },
      { l: 1, r: 2 },
    ],
    hooks,
  );
  assert.ok(sorted, '应触发排序');
  assert.ok(moves > 0, '应发生游标平移');
  assert.equal(answers, 2);
});

test('moAlgorithm 大规模与暴力一致', () => {
  const n = 100;
  const arr: number[] = [];
  for (let i = 0; i < n; i++) arr.push(((i * 37 + 5) % 13) + 1);
  const queries: MoQuery[] = [];
  for (let i = 0; i < 60; i++) {
    const l = Math.floor((i * 17) % n);
    const r = Math.floor((i * 41) % n);
    queries.push({ l: Math.min(l, r), r: Math.max(l, r) });
  }
  const out = moAlgorithm(arr, queries);
  for (let i = 0; i < queries.length; i++) {
    const { l, r } = queries[i]!;
    assert.equal(out[i], bruteDistinct(arr, l, r), `mismatch q${i}=[${l},${r}]`);
  }
});
