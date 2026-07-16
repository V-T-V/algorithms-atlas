import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strandSort2, type Strand2Hooks } from '../../src/algorithms/sorting/sort-strand-2/impl.ts';

test('strandSort2 基本', () => {
  assert.deepEqual(strandSort2([]), []);
  assert.deepEqual(strandSort2([1]), [1]);
  assert.deepEqual(strandSort2([2, 1]), [1, 2]);
  assert.deepEqual(strandSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('strandSort2 逆序/重复', () => {
  assert.deepEqual(strandSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(strandSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('strandSort2 钩子', () => {
  let c = 0;
  strandSort2([3, 1, 2], { onStrand: () => c++ } as Strand2Hooks);
  assert.ok(c >= 1);
});
