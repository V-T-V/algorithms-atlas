import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btCombineK } from '../../src/algorithms/backtracking/bt-combine-k/impl.ts';

test('bt-combine-k C(4,2) 枚举 6 个', () => {
  const r = btCombineK(4, 2).map((c) => JSON.stringify(c));
  const expected = ['[1,2]', '[1,3]', '[1,4]', '[2,3]', '[2,4]', '[3,4]'];
  assert.deepEqual(r.sort(), expected.sort());
});

test('bt-combine-k C(5,3) = 10', () => {
  assert.equal(btCombineK(5, 3).length, 10);
});

test('bt-combine-k C(n,0) = 1 空组合', () => {
  assert.deepEqual(btCombineK(5, 0), [[]]);
});

test('bt-combine-k C(n,n) = 1 全选', () => {
  assert.equal(btCombineK(3, 3).length, 1);
  assert.deepEqual(btCombineK(3, 3)[0], [1, 2, 3]);
});
