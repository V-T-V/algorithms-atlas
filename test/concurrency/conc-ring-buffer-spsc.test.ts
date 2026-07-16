import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSpsc } from '../../src/algorithms/concurrency/conc-ring-buffer-spsc/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-ring-buffer-spsc/trace.ts';

test('spsc FIFO', () => {
  const steps = simulateSpsc(4, [
    { action: 'produce', value: 1 },
    { action: 'produce', value: 2 },
    { action: 'consume' },
  ]);
  assert.equal(steps[2]!.buf[0], null); // 1 被消费
  assert.equal(steps[2]!.buf[1], 2);
});
test('spsc trace 非空', () => assert.ok(buildTrace().length > 0));
