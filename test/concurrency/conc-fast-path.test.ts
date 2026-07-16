import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateFastPath } from '../../src/algorithms/concurrency/conc-fast-path/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-fast-path/trace.ts';

test('conc-fast-path 无竞争走 fast', () => {
  const steps = simulateFastPath(2, [
    { thread: 0, action: 'lock' },
    { thread: 0, action: 'unlock' },
  ]);
  assert.equal(steps[0]!.path, 'fast');
  assert.equal(steps[1]!.path, 'fast');
});

test('conc-fast-path 有竞争走 slow', () => {
  const steps = simulateFastPath(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  assert.equal(steps[1]!.path, 'slow');
  assert.deepEqual(steps[1]!.queue, [1]);
});

test('conc-fast-path trace', () => {
  assert.ok(buildTrace().length > 2);
});
