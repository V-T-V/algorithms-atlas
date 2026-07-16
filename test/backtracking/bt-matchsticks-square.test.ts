import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makesquare } from '../../src/algorithms/backtracking/bt-matchsticks-square/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-matchsticks-square/trace.ts';
test('makesquare 正确', () => {
  assert.equal(makesquare([1, 1, 2, 2, 2]), true);
  assert.equal(makesquare([3, 3, 3, 3, 4]), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
