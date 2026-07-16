import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffWaysToCompute } from '../../src/algorithms/backtracking/bt-different-ways-paren/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-different-ways-paren/trace.ts';
test('diffWaysToCompute 正确', () => {
  const v = diffWaysToCompute('2-1-1').sort((a, b) => a - b);
  assert.deepEqual(v, [0, 2]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
