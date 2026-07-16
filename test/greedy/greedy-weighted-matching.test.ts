import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  greedyWeightedMatching,
  type WEdge,
} from '../../src/algorithms/greedy/greedy-weighted-matching/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-weighted-matching/trace.ts';
test('最大权匹配取最高边', () => {
  const E: WEdge[] = [
    { u: 0, v: 1, w: 10 },
    { u: 1, v: 2, w: 1 },
  ];
  const r = greedyWeightedMatching(E);
  assert.ok(r.total >= 10);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
