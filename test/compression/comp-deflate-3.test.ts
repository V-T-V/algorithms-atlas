import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflateEncode } from '../../src/algorithms/compression/comp-deflate-3/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-deflate-3/trace.ts';

test('deflate 含 match', () => {
  const t = deflateEncode('abcabcabcabc', 16, 3);
  assert.ok(t.some((x) => x.kind === 'match'));
});
test('deflate trace 非空', () => assert.ok(buildTrace().length > 0));
