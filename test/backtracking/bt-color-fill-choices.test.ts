import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominoTiling } from '../../src/algorithms/backtracking/bt-color-fill-choices/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-color-fill-choices/trace.ts';
test('dominoTiling 正确', () => {
  assert.equal(dominoTiling(2), 2);
  assert.equal(dominoTiling(3), 3);
  assert.equal(dominoTiling(4), 5);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
