import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mcsLock } from '../../src/algorithms/concurrency/conc-mcs-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-mcs-lock/trace.ts';
test('mcs FIFO 顺序', () => {
  const { order } = mcsLock([1, 2, 3]);
  assert.deepEqual(order, [1, 2, 3]);
});
test('mcs trace 非空', () => assert.ok(buildTrace().length >= 2));
