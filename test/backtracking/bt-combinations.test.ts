import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combine } from '../../src/algorithms/backtracking/bt-combinations/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-combinations/trace.ts';
test('combine 正确', () => {
  assert.equal(combine(4, 2).length, 6);
  assert.deepEqual(combine(1, 1), [[1]]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
