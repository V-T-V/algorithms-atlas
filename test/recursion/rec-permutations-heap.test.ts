import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  heapPermutations,
  heapPermutationsIter,
} from '../../src/algorithms/recursion/rec-permutations-heap/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-permutations-heap/trace.ts';

test('rec-permutations-heap 数量正确', () => {
  assert.equal(heapPermutations([1, 2, 3]).length, 6);
  assert.equal(heapPermutations([1, 2, 3, 4]).length, 24);
});

test('rec-permutations-heap 排列各不相同', () => {
  const res = heapPermutations([1, 2, 3]);
  const set = new Set(res.map((p) => p.join(',')));
  assert.equal(set.size, 6);
});

test('rec-permutations-heap 递归与迭代一致', () => {
  const a = heapPermutations([1, 2, 3, 4])
    .map((p) => p.join(','))
    .sort();
  const b = heapPermutationsIter([1, 2, 3, 4])
    .map((p) => p.join(','))
    .sort();
  assert.deepEqual(a, b);
});

test('rec-permutations-heap 空数组', () => {
  assert.deepEqual(heapPermutations([]), [[]]);
});

test('rec-permutations-heap trace', () => {
  assert.ok(buildTrace().length > 2);
});
