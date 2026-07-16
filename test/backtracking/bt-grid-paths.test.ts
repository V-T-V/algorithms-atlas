import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gridPaths } from '../../src/algorithms/backtracking/bt-grid-paths/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-grid-paths/trace.ts';
test('gridPaths 正确', () => {
  assert.equal(gridPaths(3, 3).length, 6);
  assert.equal(gridPaths(2, 2).length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
