import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateEventCount } from '../../src/algorithms/concurrency/conc-event-count/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-event-count/trace.ts';

test('event count advance 增加 count', () => {
  const steps = simulateEventCount([{ thread: 0, action: 'advance' }]);
  assert.equal(steps[0]!.count, 1);
});
test('event count await ticket 满足后唤醒', () => {
  const steps = simulateEventCount([
    { thread: 0, action: 'await', ticket: 1 },
    { thread: 1, action: 'advance' },
  ]);
  assert.equal(steps[1]!.count, 1);
  assert.deepEqual(steps[1]!.waiters, []);
});
test('event count trace 非空', () => assert.ok(buildTrace().length > 0));
