import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prevPermutation } from '../../src/algorithms/misc/misc-prev-permutation/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/misc-prev-permutation/trace.ts';

test('prev-permutation 3,2,1 -> 3,1,2', () => {
  const a = [3, 2, 1];
  prevPermutation(a);
  assert.deepEqual(a, [3, 1, 2]);
});

test('prev-permutation 1,2,3 -> 3,2,1 (回绕)', () => {
  const a = [1, 2, 3];
  assert.equal(prevPermutation(a), false);
  assert.deepEqual(a, [3, 2, 1]);
});

test('prev-permutation 1,5,1 -> 1,1,5', () => {
  const a = [1, 5, 1];
  prevPermutation(a);
  assert.deepEqual(a, [1, 1, 5]);
});

test('prev-permutation 单元素', () => {
  const a = [5];
  assert.equal(prevPermutation(a), false);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
