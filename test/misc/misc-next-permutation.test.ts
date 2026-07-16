import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  nextPermutation,
  generatePermutations,
} from '../../src/algorithms/misc/misc-next-permutation/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/misc-next-permutation/trace.ts';

test('next-permutation 1,2,3 -> 1,3,2', () => {
  const a = [1, 2, 3];
  nextPermutation(a);
  assert.deepEqual(a, [1, 3, 2]);
});

test('next-permutation 3,2,1 -> 1,2,3 (回绕)', () => {
  const a = [3, 2, 1];
  assert.equal(nextPermutation(a), false);
  assert.deepEqual(a, [1, 2, 3]);
});

test('next-permutation 1,1,5 -> 1,5,1', () => {
  const a = [1, 1, 5];
  nextPermutation(a);
  assert.deepEqual(a, [1, 5, 1]);
});

test('next-permutation 生成全排列', () => {
  const perms = generatePermutations([1, 2, 3], 10);
  assert.deepEqual(perms, [
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ]);
});

test('next-permutation 单元素', () => {
  const a = [5];
  assert.equal(nextPermutation(a), false);
  assert.deepEqual(a, [5]);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
