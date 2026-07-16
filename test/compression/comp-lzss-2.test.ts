import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lzssEncode } from '../../src/algorithms/compression/comp-lzss-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-lzss-2/trace.ts';

test('lzss 编码字面与匹配', () => {
  const t = lzssEncode('ABABABABABC', 8, 3);
  assert.ok(t.some((x) => x.flag === 0));
  assert.ok(t.some((x) => x.flag === 1));
});
test('lzss trace 非空', () => assert.ok(buildTrace().length > 0));
