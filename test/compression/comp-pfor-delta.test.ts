import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pforDeltaEncode } from '../../src/algorithms/compression/comp-pfor-delta/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-pfor-delta/trace.ts';
test('pfor 大值进异常', () => {
  const { exc } = pforDeltaEncode([1, 2, 100], 4);
  assert.equal(exc.length, 1);
});
test('pfor trace 非空', () => assert.ok(buildTrace().length >= 2));
