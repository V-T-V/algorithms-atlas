import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findLocalMinimum,
  type LocalMinHooks,
} from '../../src/algorithms/searching/search-local-min/impl.ts';

test('findLocalMinimum 是局部最小', () => {
  const A = [9, 6, 3, 14, 5, 7, 4];
  const i = findLocalMinimum(A);
  const v = A[i]!;
  assert.ok((i === 0 || v < A[i - 1]!) && (i === A.length - 1 || v < A[i + 1]!));
});
test('findLocalMinimum 单调', () => {
  assert.equal(findLocalMinimum([5, 4, 3, 2, 1]), 4);
  assert.equal(findLocalMinimum([1, 2, 3, 4, 5]), 0);
});
test('findLocalMinimum 边界', () => {
  assert.equal(findLocalMinimum([5]), 0);
  assert.equal(findLocalMinimum([2, 1]), 1);
});
test('findLocalMinimum 钩子', () => {
  let c = 0;
  findLocalMinimum([9, 6, 3, 14, 5, 7, 4], { onCompare: () => c++ } as LocalMinHooks);
  assert.ok(c >= 1);
});
