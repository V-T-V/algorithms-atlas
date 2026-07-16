import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaptiveHuffman } from '../../src/algorithms/compression/comp-huffman-5/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-huffman-5/trace.ts';

test('adaptive huffman 输出非空', () => {
  const s = adaptiveHuffman([65, 66, 65, 66, 67]);
  assert.ok(s.length > 0);
});
test('adaptive huffman trace 非空', () => assert.ok(buildTrace().length > 0));
