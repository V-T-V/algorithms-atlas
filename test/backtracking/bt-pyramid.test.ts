import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pyramidTransition } from '../../src/algorithms/backtracking/bt-pyramid/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-pyramid/trace.ts';
test('pyramidTransition 正确', () => {
  assert.equal(pyramidTransition('BCD', ['BCG', 'CDE', 'GEA', 'FFF']), true);
  assert.equal(pyramidTransition('AAAA', ['AAB', 'AAC', 'BCD', 'CDE', 'DEF']), true);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
