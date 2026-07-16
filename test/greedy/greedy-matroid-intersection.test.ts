import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matroidIntersection } from '../../src/algorithms/greedy/greedy-matroid-intersection/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-matroid-intersection/trace.ts';
test('拟阵交返回非空', () => {
  const S = matroidIntersection([
    [0, 1],
    [2, 3],
    [4, 5],
  ]);
  assert.ok(S.length >= 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
