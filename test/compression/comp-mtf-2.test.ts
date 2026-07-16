import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mtfEncode, mtfDecode } from '../../src/algorithms/compression/comp-mtf-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-mtf-2/trace.ts';

test('mtf round-trip', () => {
  const alpha = [97, 98, 110]; // a b n
  const data = [98, 97, 110, 97, 110, 97]; // banana
  const enc = mtfEncode(data, alpha);
  const dec = mtfDecode(enc, [...alpha]);
  assert.deepEqual(dec, data);
});
test('mtf trace 非空', () => assert.ok(buildTrace().length > 0));
