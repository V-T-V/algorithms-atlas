import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  patienceSort3,
  type Patience3Hooks,
} from '../../src/algorithms/sorting/sort-patience-3/impl.ts';

test('patienceSort3 基本', () => {
  assert.deepEqual(patienceSort3([]), []);
  assert.deepEqual(patienceSort3([1]), [1]);
  assert.deepEqual(patienceSort3([2, 1]), [1, 2]);
  assert.deepEqual(patienceSort3([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('patienceSort3 逆序/重复', () => {
  assert.deepEqual(patienceSort3([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(patienceSort3([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('patienceSort3 钩子', () => {
  let c = 0;
  patienceSort3([3, 1, 2], { onPile: () => c++ } as Patience3Hooks);
  assert.ok(c >= 1);
});
