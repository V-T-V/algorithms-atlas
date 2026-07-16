import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contextSwitchCount } from '../../src/algorithms/scheduling/sched-context-switch-count/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-context-switch-count/trace.ts';
test('contextSwitchCount 正确', () => {
  assert.equal(
    contextSwitchCount([
      { id: 'A', start: 0, end: 2 },
      { id: 'B', start: 2, end: 4 },
      { id: 'A', start: 4, end: 6 },
    ]),
    2,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
