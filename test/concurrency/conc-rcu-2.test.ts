import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRcu } from '../../src/algorithms/concurrency/conc-rcu-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-rcu-2/trace.ts';

test('rcu update 增加 version', () => {
  const steps = simulateRcu([{ thread: 0, action: 'update' }]);
  assert.equal(steps[0]!.version, 2);
});
test('rcu 宽限期回收旧版本', () => {
  const steps = simulateRcu([
    { thread: 0, action: 'update' },
    { thread: 1, action: 'synchronize' },
  ]);
  assert.equal(steps[1]!.pendingReclaim.length, 0);
});
test('rcu trace 非空', () => assert.ok(buildTrace().length > 0));
