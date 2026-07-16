import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSlowPath } from '../../src/algorithms/concurrency/conc-slow-path/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-slow-path/trace.ts';

test('conc-slow-path FIFO 公平', () => {
  const steps = simulateSlowPath(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 2, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
    { thread: 2, action: 'unlock' },
  ]);
  // T1 在 T0 释放后立即获得，T2 在 T1 释放后获得
  assert.equal(steps[3]!.holder, 1);
  assert.equal(steps[4]!.holder, 2);
});

test('conc-slow-path 临界区至多一人', () => {
  const steps = simulateSlowPath(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  assert.equal(steps[1]!.state, 1); // 仍是 T0
  assert.deepEqual(steps[1]!.queue, [1]);
});

test('conc-slow-path trace', () => {
  assert.ok(buildTrace().length > 2);
});
