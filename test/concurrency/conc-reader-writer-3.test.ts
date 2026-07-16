import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRwLock } from '../../src/algorithms/concurrency/conc-reader-writer-3/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-reader-writer-3/trace.ts';

test('rw 多读者并发', () => {
  const steps = simulateRwLock([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'rlock' },
  ]);
  assert.equal(steps[1]!.activeReaders, 2);
});
test('rw 写者阻塞当有读者', () => {
  const steps = simulateRwLock([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'wlock' },
  ]);
  assert.equal(steps[1]!.writerActive, false);
  assert.equal(steps[1]!.writerWaiting, 1);
});
test('rw trace 非空', () => assert.ok(buildTrace().length > 0));
