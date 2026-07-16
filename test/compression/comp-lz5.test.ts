import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz5Encode } from '../../src/algorithms/compression/comp-lz5/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz5/trace.ts';

test('lz5 长匹配', () => {
  const t = lz5Encode('ABCDEFGHIJKLMNOPABCDEFGHIJKLMNOP', 32);
  assert.ok(t.some((x) => x.matchLen + 4 >= 16));
});
test('lz5 trace 非空', () => assert.ok(buildTrace().length > 0));
