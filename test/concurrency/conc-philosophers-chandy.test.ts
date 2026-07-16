import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chandyMisra } from '../../src/algorithms/concurrency/conc-philosophers-chandy/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-philosophers-chandy/trace.ts';
test('cm 每人至少进餐', () => {
  const e = chandyMisra(3, 3);
  assert.equal(e.length, 3);
});
test('cm trace 非空', () => assert.ok(buildTrace().length >= 2));
