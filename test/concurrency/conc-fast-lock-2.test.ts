import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateFastLock } from '../../src/algorithms/concurrency/conc-fast-lock-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-fast-lock-2/trace.ts';

test('fast lock 无竞争直接获得', () => {
  const steps = simulateFastLock([{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.state, 'locked');
  assert.equal(steps[0]!.holder, 0);
});
test('fast lock 竞争入队', () => {
  const steps = simulateFastLock([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  assert.deepEqual(steps[1]!.queue, [1]);
});
test('fast lock trace 非空', () => assert.ok(buildTrace().length > 0));
