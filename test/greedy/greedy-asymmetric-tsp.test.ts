import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nearestNeighborTsp } from '../../src/algorithms/greedy/greedy-asymmetric-tsp/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-asymmetric-tsp/trace.ts';
test('TSP 回路访问所有城市', () => {
  const r = nearestNeighborTsp([
    [0, 1, 2],
    [1, 0, 3],
    [2, 3, 0],
  ]);
  const uniq = new Set(r.tour);
  assert.ok(uniq.size === 3);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
