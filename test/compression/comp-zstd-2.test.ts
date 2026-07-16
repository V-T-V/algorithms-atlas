import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zstdEncode } from '../../src/algorithms/compression/comp-zstd-2/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-zstd-2/trace.ts';

test('zstd 含 match', () => {
  const t = zstdEncode('ABABABABABABABCDCDCDCD', 16, 3);
  assert.ok(t.some((x) => x.kind === 'match'));
});
test('zstd trace 非空', () => assert.ok(buildTrace().length > 0));
