import { test } from 'node:test';
import assert from 'node:assert/strict';
import { streamVByteEncode } from '../../src/algorithms/compression/comp-streamvbyte/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-streamvbyte/trace.ts';
test('svb 数据字节数正确', () => {
  const { data } = streamVByteEncode([1, 300, 70000]);
  assert.equal(data.length, 1 + 2 + 3);
});
test('svb trace 非空', () => assert.ok(buildTrace().length >= 2));
