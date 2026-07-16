import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bestFitBinPacking } from '../../src/algorithms/greedy/greedy-best-fit/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-best-fit/trace.ts';
test('装箱数为正', () => {
  assert.ok(bestFitBinPacking([5, 5, 5], 10) >= 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
