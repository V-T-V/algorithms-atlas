import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyHuffman3 } from '../../src/algorithms/greedy/greedy-huffman-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-huffman-3/trace.ts';

test('Huffman 单字符编码 "0"', () => {
  const r = greedyHuffman3([{ char: 'a', freq: 1 }]);
  assert.equal(r.codes.a, '0');
});

test('Huffman 多字符前缀码无歧义', () => {
  const r = greedyHuffman3([
    { char: 'a', freq: 5 },
    { char: 'b', freq: 9 },
    { char: 'c', freq: 12 },
  ]);
  const codes = Object.values(r.codes);
  for (let i = 0; i < codes.length; i++)
    for (let j = 0; j < codes.length; j++) {
      if (i !== j) assert.ok(!codes[i]!.startsWith(codes[j]!));
    }
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
