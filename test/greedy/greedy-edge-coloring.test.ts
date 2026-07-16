import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyEdgeColoring } from '../../src/algorithms/greedy/greedy-edge-coloring/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-edge-coloring/trace.ts';
test('三角形需 3 色', () => {
  assert.equal(
    greedyEdgeColoring([
      [0, 1],
      [1, 2],
      [2, 0],
    ]),
    3,
  );
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
