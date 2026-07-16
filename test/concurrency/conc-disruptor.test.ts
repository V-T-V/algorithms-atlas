import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateDisruptor } from '../../src/algorithms/concurrency/conc-disruptor/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-disruptor/trace.ts';

test('disruptor cursor 递增', () => {
  const steps = simulateDisruptor(4, 2, [
    { thread: 0, action: 'publish', value: 1 },
    { thread: 0, action: 'publish', value: 2 },
  ]);
  assert.equal(steps[1]!.cursor, 1);
});
test('disruptor 消费者跟随', () => {
  const steps = simulateDisruptor(4, 2, [{ thread: 0, action: 'publish', value: 9 }]);
  assert.deepEqual(steps[0]!.consumerSeqs, [0, 0]);
});
test('disruptor trace 非空', () => assert.ok(buildTrace().length > 0));
