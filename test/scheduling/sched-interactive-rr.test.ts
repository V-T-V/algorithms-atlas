import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interactiveRR } from '../../src/algorithms/scheduling/sched-interactive-rr/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-interactive-rr/trace.ts';
test('interactiveRR 正确', () => {
  const r = interactiveRR(
    [
      { id: 'A', arrival: 0, burst: 4 },
      { id: 'B', arrival: 0, burst: 2 },
    ],
    1,
  );
  assert.ok(r.segments.length >= 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
