import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asyncTaskPool } from '../../src/algorithms/concurrency/conc-async-pool/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-async-pool/trace.ts';
test('pool 不超过并发上限', () => {
  const o = asyncTaskPool([0, 1, 2, 3], 2);
  assert.ok(o.length <= 2);
});
test('pool trace 非空', () => assert.ok(buildTrace().length >= 2));
