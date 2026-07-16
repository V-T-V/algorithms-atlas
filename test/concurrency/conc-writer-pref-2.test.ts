import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateWriterPref } from '../../src/algorithms/concurrency/conc-writer-pref-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-writer-pref-2/trace.ts';

test('writer-pref 写者等待阻塞读者', () => {
  const steps = simulateWriterPref([
    { thread: 0, action: 'rlock' },
    { thread: 1, action: 'wlock' },
    { thread: 2, action: 'rlock' },
  ]);
  assert.equal(steps[2]!.activeReaders, 1); // T2 没进入
});
test('writer-pref trace 非空', () => assert.ok(buildTrace().length > 0));
