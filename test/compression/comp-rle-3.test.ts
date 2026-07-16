import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rleEncode, rleDecode } from '../../src/algorithms/compression/comp-rle-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rle-3/trace.ts';

test('rle round-trip', () => {
  const data = 'AAAAAABCDEF'.split('').map((c) => c.charCodeAt(0));
  const enc = rleEncode(data, 3);
  assert.deepEqual(rleDecode(enc), data);
});
test('rle 长游程被压缩', () => {
  const data = Array.from({ length: 10 }, () => 65); // 10 个 A
  const enc = rleEncode(data, 3);
  assert.ok(enc.length < data.length);
});
test('rle trace 非空', () => assert.ok(buildTrace().length > 0));
