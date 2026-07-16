import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rleEscapeEncode,
  rleEscapeDecode,
} from '../../src/algorithms/compression/comp-rle-escape/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-rle-escape/trace.ts';
test('rle-escape 往返', () => {
  const e = rleEscapeEncode([7, 7, 7, 7, 7, 2, 3]);
  assert.deepEqual(rleEscapeDecode(e), [7, 7, 7, 7, 7, 2, 3]);
});
test('rle-escape trace 非空', () => assert.ok(buildTrace().length >= 2));
