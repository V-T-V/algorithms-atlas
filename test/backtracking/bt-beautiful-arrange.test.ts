import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countArrangement } from '../../src/algorithms/backtracking/bt-beautiful-arrange/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-beautiful-arrange/trace.ts';
test('countArrangement 正确', () => {
  assert.equal(countArrangement(2), 2);
  assert.equal(countArrangement(1), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
