import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spscRing } from '../../src/algorithms/concurrency/conc-spsc-ring/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-spsc-ring/trace.ts';
test('spsc FIFO', () => {
  const r = spscRing(4, [{ op: 'enq', v: 1 }, { op: 'enq', v: 2 }, { op: 'deq' }, { op: 'deq' }]);
  assert.equal(r.buf.length, 0);
});
test('spsc trace 非空', () => assert.ok(buildTrace().length >= 2));
