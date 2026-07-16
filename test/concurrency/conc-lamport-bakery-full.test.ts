import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bakeryLock } from '../../src/algorithms/concurrency/conc-lamport-bakery-full/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-lamport-bakery-full/trace.ts';
test('bakery 互斥后号归0', () => {
  const { nums } = bakeryLock(3);
  assert.deepEqual(nums, [0, 0, 0]);
});
test('bakery trace 非空', () => assert.ok(buildTrace().length >= 2));
