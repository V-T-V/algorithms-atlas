import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalHuffman,
  buildCodeLengths,
} from '../../src/algorithms/compression/comp-huffman-4/impl.ts';
import { buildTrace } from '../../src/algorithms/compression/comp-huffman-4/trace.ts';

test('canonical huffman 码字无前缀冲突', () => {
  const freq = new Map([
    ['A'.charCodeAt(0), 5],
    ['B'.charCodeAt(0), 2],
    ['C'.charCodeAt(0), 1],
    ['D'.charCodeAt(0), 1],
  ]);
  const codes = canonicalHuffman(freq);
  // 验证前缀性质：任意两码字互不为前缀
  for (let i = 0; i < codes.length; i++)
    for (let j = 0; j < codes.length; j++) {
      if (i === j) continue;
      const a = codes[i]!;
      const b = codes[j]!;
      const aBits = a.code.toString(2).padStart(a.len, '0');
      const bBits = b.code.toString(2).padStart(b.len, '0');
      assert.ok(!aBits.startsWith(bBits) || aBits === bBits);
    }
});
test('canonical huffman 单符号码长 1', () => {
  const lens = buildCodeLengths(new Map([[42, 10]]));
  assert.equal(lens.get(42), 1);
});
test('canonical huffman trace 非空', () => assert.ok(buildTrace().length > 0));
