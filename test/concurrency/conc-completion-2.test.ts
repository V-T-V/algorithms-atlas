import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateCompletion } from '../../src/algorithms/concurrency/conc-completion-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-completion-2/trace.ts';

test('completion count_down 到 0 释放等待者', () => {
  const steps = simulateCompletion(2, [
    { thread: 0, action: 'await' },
    { thread: 1, action: 'count_down' },
    { thread: 2, action: 'count_down' },
  ]);
  assert.equal(steps[2]!.count, 0);
  assert.deepEqual(steps[2]!.waiters, []);
});
test('completion trace 非空', () => assert.ok(buildTrace().length > 0));
