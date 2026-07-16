import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityQueueLock } from '../../src/algorithms/concurrency/conc-priority-queue-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-priority-queue-lock/trace.ts';
test('pql 高优先级先', () =>
  assert.deepEqual(
    priorityQueueLock([
      { tid: 1, prio: 1 },
      { tid: 2, prio: 5 },
    ]),
    [2, 1],
  ));
test('pql trace 非空', () => assert.ok(buildTrace().length >= 2));
