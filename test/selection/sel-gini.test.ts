import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gini } from '../../src/algorithms/selection/sel-gini/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-gini/trace.ts';

test('gini 完全均匀 = 0', () => {
  assert.ok(Math.abs(gini([5, 5, 5, 5])) < 1e-9);
});
test('gini 范围 [0,1)', () => {
  const g = gini([1, 1, 1, 1, 1, 100]);
  assert.ok(g > 0.5 && g < 1);
});
test('gini trace 非空', () => assert.ok(buildTrace().length > 0));
