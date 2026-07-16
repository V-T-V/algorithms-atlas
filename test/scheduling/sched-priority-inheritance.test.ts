import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityInheritance } from '../../src/algorithms/scheduling/sched-priority-inheritance/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-priority-inheritance/trace.ts';
test('priorityInheritance 正确', () => {
  const eff = priorityInheritance(
    [
      { id: 'L', arrival: 0, burst: 1, priority: 5, holding: ['R'] },
      { id: 'H', arrival: 0, burst: 1, priority: 1, holding: [] },
    ],
    new Map([['H', 'R']]),
  );
  assert.equal(eff.get('L'), 1);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
