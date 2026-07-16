import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateClh } from '../../src/algorithms/concurrency/concent-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/concent-lock/trace.ts';

test('CLH 单 acquire 持有', () => {
  const steps = simulateClh([{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.holder, 0);
});
test('CLH unlock 释放', () => {
  const steps = simulateClh([
    { thread: 0, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[1]!.holder, -1);
});
test('CLH trace 非空', () => assert.ok(buildTrace().length > 0));
