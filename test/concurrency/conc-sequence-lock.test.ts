import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSeqLock } from '../../src/algorithms/concurrency/conc-sequence-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-sequence-lock/trace.ts';

test('seqlock 写入改变 seq', () => {
  const steps = simulateSeqLock([{ thread: 0, action: 'write-begin' }]);
  assert.equal(steps[0]!.seq % 2, 1);
});
test('seqlock 写入完成后 seq 偶', () => {
  const steps = simulateSeqLock([
    { thread: 0, action: 'write-begin' },
    { thread: 0, action: 'write-end' },
  ]);
  assert.equal(steps[1]!.seq % 2, 0);
});
test('seqlock trace 非空', () => assert.ok(buildTrace().length > 0));
