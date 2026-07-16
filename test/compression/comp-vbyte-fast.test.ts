import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vbyteEncode, vbyteDecode } from '../../src/algorithms/compression/comp-vbyte-fast/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-vbyte-fast/trace.ts';
test('vbyte 往返', () => {
  const e = vbyteEncode([0, 127, 128, 300]);
  assert.deepEqual(vbyteDecode(e), [0, 127, 128, 300]);
});
test('vbyte 127 单字节', () => assert.equal(vbyteEncode([127]).length, 1));
test('vbyte trace 非空', () => assert.ok(buildTrace().length >= 2));
