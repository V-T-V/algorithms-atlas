import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRwSem } from '../../src/algorithms/concurrency/conc-rwsem/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-rwsem/trace.ts';

test('rwsem 写者降级', () => {
  const steps = simulateRwSem([
    { thread: 0, action: 'down_write' },
    { thread: 0, action: 'downgrade' },
  ]);
  assert.equal(steps[1]!.writer, -1);
  assert.equal(steps[1]!.readers, 1);
});
test('rwsem trace 非空', () => assert.ok(buildTrace().length > 0));
