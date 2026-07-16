import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedySteinerTree } from '../../src/algorithms/greedy/greedy-steiner-tree/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-steiner-tree/trace.ts';
test('Steiner 权重为正', () => {
  const D = [
    [0, 1, 2],
    [1, 0, 3],
    [2, 3, 0],
  ];
  const w = greedySteinerTree(D, [0, 1, 2]);
  assert.ok(w > 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
