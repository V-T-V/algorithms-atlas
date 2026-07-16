import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalHuffman } from '../../src/algorithms/greedy/greedy-huffman-canonical/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-huffman-canonical/trace.ts';
test('高频符号码更短', () => {
  const t = canonicalHuffman([
    ['a', 1],
    ['b', 9],
  ]);
  assert.ok((t.get('b')?.len ?? 9) <= (t.get('a')?.len ?? 0));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
