import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinDifference } from '../../src/algorithms/backtracking/bt-find-min-time-diff/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-find-min-time-diff/trace.ts';
test('findMinDifference 正确', () => {
  assert.equal(findMinDifference(['23:59', '00:00']), 1);
  assert.equal(findMinDifference(['00:00', '23:59', '00:00']), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
