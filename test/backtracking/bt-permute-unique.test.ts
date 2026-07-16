import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permuteUnique } from '../../src/algorithms/backtracking/bt-permute-unique/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-permute-unique/trace.ts';
test('permuteUnique 正确', () => {
  assert.equal(permuteUnique([1, 1, 2]).length, 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
