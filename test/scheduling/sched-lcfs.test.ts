import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcfs } from '../../src/algorithms/scheduling/sched-lcfs/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-lcfs/trace.ts';
test('lcfs 正确', () => {
  const r = lcfs([
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 1, burst: 2 },
    { id: 'C', arrival: 2, burst: 1 },
  ]);
  assert.equal(r.order[0], 'A');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
