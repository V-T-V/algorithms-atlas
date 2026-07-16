import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulawEncode, mulawDecode } from '../../src/algorithms/compression/comp-mulaw/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-mulaw/trace.ts';
test('mulaw 大致可逆', () => {
  const e = mulawEncode([1000, -1000]);
  const d = mulawDecode(e);
  assert.ok(Math.abs(d[0]! - 1000) < 5000);
});
test('mulaw 输出 0-255', () => {
  for (const b of mulawEncode([0, 32767, -32768])) assert.ok(b >= 0 && b <= 255);
});
test('mulaw trace 非空', () => assert.ok(buildTrace().length >= 2));
