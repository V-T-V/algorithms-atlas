import { test } from 'node:test';
import assert from 'node:assert/strict';
import { edf } from '../../src/algorithms/scheduling/sched-edf/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-edf/trace.ts';
test('edf 正确', () => {
  const { result: r, missed } = edf([
    { id: 'A', arrival: 0, burst: 2, deadline: 4 },
    { id: 'B', arrival: 0, burst: 3, deadline: 6 },
    { id: 'C', arrival: 0, burst: 1, deadline: 3 },
  ]);
  assert.deepEqual(r.order, ['C', 'A', 'B']);
  assert.equal(missed, 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
