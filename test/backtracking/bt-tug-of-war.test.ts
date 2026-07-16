import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tugOfWar } from '../../src/algorithms/backtracking/bt-tug-of-war/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-tug-of-war/trace.ts';
test('tugOfWar 正确', () => {
  const d = tugOfWar([23, 45, -34, 12, 0, 98, -99, 4, 189, -1, 4]);
  assert.ok(d >= 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
