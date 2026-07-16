import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxCut } from '../../src/algorithms/greedy/greedy-max-cut/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-max-cut/trace.ts';
test('最大割非负', () => {
  const r = greedyMaxCut(4, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]);
  assert.ok(r.cutSize >= 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
