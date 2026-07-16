import { test } from 'node:test';
import assert from 'node:assert/strict';
import { truncatedBinaryEncode } from '../../src/algorithms/compression/comp-truncated-binary/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-truncated-binary/trace.ts';
test('tb n=6 总位数', () => {
  const c = truncatedBinaryEncode([0, 1, 2, 3, 4, 5], 6);
  assert.equal(c.length, 17);
});
test('tb trace 非空', () => assert.ok(buildTrace().length >= 2));
