import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz4BlockEncode } from '../../src/algorithms/compression/comp-lz4-block/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz4-block/trace.ts';
test('lz4 重复数据更小', () => {
  const o = lz4BlockEncode([1, 2, 3, 4, 1, 2, 3, 4], 4);
  assert.ok(o.length < 8);
});
test('lz4 trace 非空', () => assert.ok(buildTrace().length >= 2));
