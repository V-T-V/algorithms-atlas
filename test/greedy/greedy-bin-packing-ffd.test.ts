import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstFitDecreasing } from '../../src/algorithms/greedy/greedy-bin-packing-ffd/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-bin-packing-ffd/trace.ts';
test('小物品用更少箱', () => {
  const n = firstFitDecreasing([3, 3, 3, 3], 10);
  assert.equal(n, 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
