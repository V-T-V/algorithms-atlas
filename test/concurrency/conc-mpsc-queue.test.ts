import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mpscQueue } from '../../src/algorithms/concurrency/conc-mpsc-queue/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-mpsc-queue/trace.ts';
test('mpsc FIFO', () =>
  assert.deepEqual(
    mpscQueue([
      { op: 'enq', tid: 1, v: 1 },
      { op: 'enq', tid: 2, v: 2 },
      { op: 'deq' },
      { op: 'deq' },
    ]),
    [1, 2],
  ));
test('mpsc trace 非空', () => assert.ok(buildTrace().length >= 2));
