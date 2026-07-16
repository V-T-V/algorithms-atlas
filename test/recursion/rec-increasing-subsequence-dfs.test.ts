import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lengthOfLIS,
  findLIS,
} from '../../src/algorithms/recursion/rec-increasing-subsequence-dfs/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-increasing-subsequence-dfs/trace.ts';

test('rec-increasing-subsequence-dfs 基本长度', () => {
  assert.equal(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
});

test('rec-increasing-subsequence-dfs 全递增', () => {
  assert.equal(lengthOfLIS([1, 2, 3, 4, 5]), 5);
});

test('rec-increasing-subsequence-dfs 全递减', () => {
  assert.equal(lengthOfLIS([5, 4, 3, 2, 1]), 1);
});

test('rec-increasing-subsequence-dfs 空数组', () => {
  assert.equal(lengthOfLIS([]), 0);
});

test('rec-increasing-subsequence-dfs 返回的序列是递增的且长度正确', () => {
  const seq = findLIS([10, 9, 2, 5, 3, 7, 101, 18]);
  assert.equal(seq.length, 4);
  for (let i = 1; i < seq.length; i++) assert.ok(seq[i - 1]! < seq[i]!);
});

test('rec-increasing-subsequence-dfs trace', () => {
  assert.ok(buildTrace().length > 2);
});
