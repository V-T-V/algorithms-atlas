import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simulatedAnneal,
  energy,
} from '../../src/algorithms/ai-search/ais-simulated-anneal-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-simulated-anneal-search/trace.ts';

test('SA 找到接近最优', () => {
  const r = simulatedAnneal(2, 0, 14, 10, 0.01, 200, 1);
  // 主峰在 x=7 附近
  assert.ok(r.x >= 5 && r.x <= 9, 'x=' + r.x);
});
test('SA 同种子可复现', () => {
  const a = simulatedAnneal(2, 0, 14, 5, 0.1, 30, 99);
  const b = simulatedAnneal(2, 0, 14, 5, 0.1, 30, 99);
  assert.deepEqual(a, b);
});
test('SA trace 非空', () => assert.ok(buildTrace().length > 0));
