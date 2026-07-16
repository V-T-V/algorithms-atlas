import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz4Encode } from '../../src/algorithms/compression/comp-lz4-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lz4-2/trace.ts';

test('lz4 长匹配被编码', () => {
  const t = lz4Encode('ABCDEFGABCDEFGABCDEFG', 16);
  assert.ok(t.some((x) => x.matchLen + 4 >= 7));
});
test('lz4 无匹配全 literal', () => {
  const t = lz4Encode('ABC', 8);
  assert.equal(t.length, 1);
  assert.equal(t[0]!.litLen, 3);
});
test('lz4 trace 非空', () => assert.ok(buildTrace().length > 0));
