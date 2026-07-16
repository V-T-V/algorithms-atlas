import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judgePoint24 } from '../../src/algorithms/backtracking/bt-calc-24/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-calc-24/trace.ts';
test('judgePoint24 正确', () => {
  assert.equal(judgePoint24([4, 1, 8, 7]), true);
  assert.equal(judgePoint24([1, 2, 1, 2]), false);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
