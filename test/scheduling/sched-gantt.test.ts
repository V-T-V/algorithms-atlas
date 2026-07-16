import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGantt } from '../../src/algorithms/scheduling/sched-gantt/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-gantt/trace.ts';
test('buildGantt 正确', () => {
  assert.equal(
    buildGantt([
      { id: 'A', start: 0, end: 3 },
      { id: 'B', start: 3, end: 5 },
    ]),
    'AAABB',
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
