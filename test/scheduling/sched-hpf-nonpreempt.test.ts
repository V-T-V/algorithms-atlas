import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hpf } from '../../src/algorithms/scheduling/sched-hpf-nonpreempt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-hpf-nonpreempt/trace.ts';
test('hpf 正确', () => {
  const r = hpf([
    { id: 'A', arrival: 0, burst: 3, priority: 2 },
    { id: 'B', arrival: 0, burst: 2, priority: 1 },
    { id: 'C', arrival: 0, burst: 1, priority: 1 },
  ]);
  assert.equal(r.order[0], 'B');
  assert.equal(r.order[1], 'C');
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
