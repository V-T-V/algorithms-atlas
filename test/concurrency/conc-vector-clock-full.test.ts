import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vectorClockFull } from '../../src/algorithms/concurrency/conc-vector-clock-full/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-vector-clock-full/trace.ts';
test('vc 本地自增', () => {
  const c = vectorClockFull(1, [{ type: 'local', pid: 0 }]);
  assert.equal(c[0]![0], 1);
});
test('vc trace 非空', () => assert.ok(buildTrace().length >= 2));
