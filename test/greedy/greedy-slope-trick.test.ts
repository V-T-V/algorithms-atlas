import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slopeTrick } from '../../src/algorithms/greedy/greedy-slope-trick/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-slope-trick/trace.ts';
test('已增序代价为 0', () => {
  assert.equal(slopeTrick([1, 2, 3, 4]), 0);
});
test('单点降序代价正确', () => {
  assert.equal(slopeTrick([5, 1]), 4);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
