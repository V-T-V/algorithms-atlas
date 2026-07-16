import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzpEncode } from '../../src/algorithms/compression/comp-lzp/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lzp/trace.ts';
test('lzp 输出标志+数据', () => {
  const o = lzpEncode([1, 2, 3]);
  assert.equal(o[0], 0);
  assert.equal(o[1], 1);
});
test('lzp trace 非空', () => assert.ok(buildTrace().length >= 2));
