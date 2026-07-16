import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btSubsetsUnique } from '../../src/algorithms/backtracking/bt-subsets-unique/impl.ts';

test('bt-subsets-unique [1,2,2] 枚举不重复子集', () => {
  const r = btSubsetsUnique([1, 2, 2]).map((s) => JSON.stringify(s));
  const expected = ['[]', '[1]', '[1,2]', '[1,2,2]', '[2]', '[2,2]'];
  assert.deepEqual(r.sort(), expected.sort());
});

test('bt-subsets-unique 全重复元素', () => {
  const r = btSubsetsUnique([0, 0]);
  assert.deepEqual(r.map((s) => JSON.stringify(s)).sort(), ['[]', '[0]', '[0,0]'].sort());
});

test('bt-subsets-unique 无重复', () => {
  const r = btSubsetsUnique([1, 2, 3]);
  assert.equal(r.length, 8);
});

test('bt-subsets-unique 空数组返回空子集', () => {
  assert.deepEqual(btSubsetsUnique([]), [[]]);
});
