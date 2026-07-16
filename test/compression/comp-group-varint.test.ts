import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupVarintEncode } from '../../src/algorithms/compression/comp-group-varint/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-group-varint/trace.ts';
test('gvb 第一个字节是 tag', () => {
  const o = groupVarintEncode([1, 2, 3, 4]);
  assert.equal(o[0], 0);
});
test('gvb trace 非空', () => assert.ok(buildTrace().length >= 2));
