import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDualPivot } from '../../src/algorithms/greedy/greedy-dual-pivot/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-dual-pivot/trace.ts';
test('双枢轴 p1<p2', () => {
  const [p1, p2] = greedyDualPivot([1, 2, 3, 4, 5], [2, 3, 4]);
  assert.ok(p1 < p2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
