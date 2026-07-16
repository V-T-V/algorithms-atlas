import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numSquares } from '../../src/algorithms/backtracking/bt-num-squares/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-num-squares/trace.ts';
test('numSquares 正确', () => {
  assert.equal(numSquares(12), 3);
  assert.equal(numSquares(13), 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
