import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyVertexCover } from '../../src/algorithms/greedy/greedy-min-vertex-cover/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-min-vertex-cover/trace.ts';
test('点覆盖非空', () => {
  const cov = greedyVertexCover(3, [
    [0, 1],
    [1, 2],
  ]);
  assert.ok(cov.length >= 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
