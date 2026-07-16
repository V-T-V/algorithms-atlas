import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateMpsc } from '../../src/algorithms/concurrency/conc-ring-buffer-mpsc/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-ring-buffer-mpsc/trace.ts';

test('mpsc FIFO', () => {
  const steps = simulateMpsc(4, [
    { thread: 1, action: 'produce', value: 1 },
    { thread: 1, action: 'produce', value: 2 },
    { thread: 0, action: 'consume' },
  ]);
  // 最后一步消费了 1
  assert.equal(steps[2]!.buf[0], null);
});
test('mpsc 满时 onFull', () => {
  let full = 0;
  simulateMpsc(
    2,
    [
      { thread: 1, action: 'produce', value: 1 },
      { thread: 1, action: 'produce', value: 2 },
      { thread: 1, action: 'produce', value: 3 }, // full
    ],
    { onFull: () => full++ },
  );
  assert.ok(full >= 1);
});
test('mpsc trace 非空', () => assert.ok(buildTrace().length > 0));
