import { test } from 'node:test';
import assert from 'node:assert/strict';
import { virtualRR } from '../../src/algorithms/scheduling/sched-virtual-round-robin/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-virtual-round-robin/trace.ts';
test('virtualRR 正确', () => {
  const r = virtualRR(
    [
      { id: 'A', arrival: 0, burst: 4, ioAt: 0, ioDur: 0 },
      { id: 'B', arrival: 0, burst: 2, ioAt: 0, ioDur: 0 },
    ],
    2,
  );
  assert.ok(r.segments.length >= 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
