import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBrLock } from '../../src/algorithms/concurrency/conc-brlock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-brlock/trace.ts';

test('brlock 各 CPU 独立计数', () => {
  const steps = simulateBrLock(2, [
    { thread: 0, cpu: 0, action: 'rlock' },
    { thread: 1, cpu: 1, action: 'rlock' },
  ]);
  assert.deepEqual(steps[1]!.perCpuReaders, [1, 1]);
});
test('brlock 写需等待读者退出', () => {
  const steps = simulateBrLock(2, [
    { thread: 0, cpu: 0, action: 'rlock' },
    { thread: 1, cpu: 0, action: 'wlock' },
  ]);
  assert.equal(steps[1]!.writerActive, false);
});
test('brlock trace 非空', () => assert.ok(buildTrace().length > 0));
