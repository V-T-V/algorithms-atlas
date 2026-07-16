import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snappyEncode } from '../../src/algorithms/compression/comp-snappy-varint/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-snappy-varint/trace.ts';
test('snappy 重复变小', () => {
  const o = snappyEncode([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
  assert.ok(o.length < 15);
});
test('snappy trace 非空', () => assert.ok(buildTrace().length >= 2));
