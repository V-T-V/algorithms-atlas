import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btSubsetWithDup } from '../../src/algorithms/backtracking/bt-subset-with-dup/impl.ts';

const asSets = (xs: number[][]): string[] =>
  xs.map((s) => [...s].sort((a, b) => a - b).join(',')).sort();

test('bt-subset-with-dup [1,2,2] 去重子集', () => {
  const got = asSets(btSubsetWithDup([1, 2, 2]));
  assert.deepEqual(got, ['', '1', '1,2', '1,2,2', '2', '2,2']);
});

test('bt-subset-with-dup 无重复子集', () => {
  const got = asSets(btSubsetWithDup([4, 4, 4, 1, 4]));
  const uniq = new Set(got);
  assert.equal(got.length, uniq.size, '不应有重复');
});

test('bt-subset-with-dup 全相同元素', () => {
  const got = asSets(btSubsetWithDup([7, 7]));
  assert.deepEqual(got, ['', '7', '7,7']);
});

test('bt-subset-with-dup 空数组', () => {
  assert.deepEqual(btSubsetWithDup([]), [[]]);
});
