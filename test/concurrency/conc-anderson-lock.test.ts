import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateAnderson } from '../../src/algorithms/concurrency/conc-anderson-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-anderson-lock/trace.ts';

test('Anderson 初始 slot[0]=true', () => {
  const steps = simulateAnderson(3, [{ thread: 0, action: 'lock' }]);
  assert.equal(steps[0]!.holder, 0);
});
test('Anderson tail 推进', () => {
  const steps = simulateAnderson(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  assert.equal(steps[1]!.tail, 2);
});
test('Anderson trace 非空', () => assert.ok(buildTrace().length > 0));
