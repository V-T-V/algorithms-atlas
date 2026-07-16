import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaptiveHuffman } from '../../src/algorithms/greedy/greedy-huffman-adaptive/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-huffman-adaptive/trace.ts';
test('高频符号编码更短', () => {
  const codes = adaptiveHuffman('aaaabbbccd');
  assert.ok((codes.get('a')?.length ?? 9) <= (codes.get('d')?.length ?? 0));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
