import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zlibWrap, adler32 } from '../../src/algorithms/compression/comp-zlib-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-zlib-2/trace.ts';

test('adler32 已知值', () => {
  // Adler-32 of "Wikipedia" = 0x11E60398
  assert.equal(adler32([87, 105, 107, 105, 112, 101, 100, 105, 97]), 0x11e60398);
});
test('zlib wrap 头部 0x78 0x9c', () => {
  const r = zlibWrap('abc');
  assert.equal(r.header[0], 0x78);
  assert.equal(r.header[1], 0x9c);
});
test('zlib trace 非空', () => assert.ok(buildTrace().length > 0));
