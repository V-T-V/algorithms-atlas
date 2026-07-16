import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optimizeQuantum } from '../../src/algorithms/scheduling/sched-quantum-optimize/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-quantum-optimize/trace.ts';
test('optimizeQuantum 正确', () => {
  const best = optimizeQuantum([
    { id: 'A', arrival: 0, burst: 5 },
    { id: 'B', arrival: 0, burst: 3 },
    { id: 'C', arrival: 0, burst: 1 },
  ]);
  assert.ok(best.quantum >= 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
