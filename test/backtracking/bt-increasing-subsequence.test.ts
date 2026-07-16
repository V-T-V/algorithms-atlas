import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btIncreasingSubsequence } from '../../src/algorithms/backtracking/bt-increasing-subsequence/impl.ts';

const norm = (xs: number[][]): string[] => xs.map((s) => s.join(',')).sort();

test('bt-increasing-subsequence [4,6,7,7]', () => {
  const res = norm(btIncreasingSubsequence([4, 6, 7, 7]));
  assert.deepEqual(res, ['4,6', '4,6,7', '4,6,7,7', '4,7', '4,7,7', '6,7', '6,7,7', '7,7']);
});

test('bt-increasing-subsequence 每个序列非递减', () => {
  for (const s of btIncreasingSubsequence([1, 2, 3, 1, 1, 2])) {
    for (let i = 1; i < s.length; i++) assert.ok(s[i]! >= s[i - 1]!);
  }
});

test('bt-increasing-subsequence 长度 ≥2', () => {
  for (const s of btIncreasingSubsequence([4, 4, 3, 2, 1])) {
    assert.ok(s.length >= 2);
  }
});

test('bt-increasing-subsequence 无重复', () => {
  const res = norm(btIncreasingSubsequence([1, 2, 1, 2]));
  const set = new Set(res);
  assert.equal(res.length, set.size);
});
