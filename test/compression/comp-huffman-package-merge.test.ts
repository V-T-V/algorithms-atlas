import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packageMerge } from '../../src/algorithms/compression/comp-huffman-package-merge/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-huffman-package-merge/trace.ts';
test('pm 码长不超过 L', () => {
  const lens = packageMerge([5, 9, 12, 13, 16, 45], 3);
  assert.ok(Math.max(...lens) <= 3);
});
test('pm trace 非空', () => assert.ok(buildTrace().length >= 2));
