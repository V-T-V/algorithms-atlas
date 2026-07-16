import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exchanger } from '../../src/algorithms/concurrency/conc-exchanger/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-exchanger/trace.ts';
test('exchanger 互换', () => {
  const r = exchanger([1, 2], [3, 4]);
  assert.deepEqual(r.a, [3, 4]);
  assert.deepEqual(r.b, [1, 2]);
});
test('exchanger trace 非空', () => assert.ok(buildTrace().length >= 2));
