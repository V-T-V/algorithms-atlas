import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalHuffman,
  computeCodeLengths,
  buildCanonicalCodes,
  encodeWith,
  decodeWith,
} from '../../src/algorithms/compression/comp-huffman-canonical/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-huffman-canonical/trace.ts';

test('canonical huffman 高频符号码长更短', () => {
  const freqs = new Map([
    [97, 50],
    [98, 5],
    [99, 1],
  ]);
  const { lengths } = canonicalHuffman(freqs);
  assert.ok((lengths.get(97) ?? 99) <= (lengths.get(99) ?? 99));
});

test('canonical huffman 码长符合规范（前缀码）', () => {
  const freqs = new Map([
    [1, 5],
    [2, 4],
    [3, 3],
    [4, 2],
    [5, 1],
  ]);
  const { codes } = canonicalHuffman(freqs);
  const list = [...codes.values()].sort();
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      assert.ok(!list[j]!.startsWith(list[i]!), `${list[i]} 是 ${list[j]} 的前缀`);
    }
  }
});

test('canonical huffman 编码往返', () => {
  const data = [97, 97, 97, 98, 99, 99];
  const freqs = new Map<number, number>();
  for (const b of data) freqs.set(b, (freqs.get(b) ?? 0) + 1);
  const { codes } = canonicalHuffman(freqs);
  const bits = encodeWith(codes, data);
  assert.deepEqual(decodeWith(codes, bits), data);
});

test('canonical huffman 单符号', () => {
  const { lengths, codes } = canonicalHuffman(new Map([[5, 10]]));
  assert.equal(lengths.get(5), 1);
  assert.equal(codes.get(5), '0');
});

test('buildCanonicalCodes 码长递增时左移', () => {
  const codes = buildCanonicalCodes(
    new Map([
      [1, 1],
      [2, 2],
      [3, 3],
    ]),
  );
  assert.deepEqual([...codes.values()].sort(), ['0', '10', '110']);
});

test('computeCodeLengths 空输入', () => {
  assert.equal(computeCodeLengths(new Map()).size, 0);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
