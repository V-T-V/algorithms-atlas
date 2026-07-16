import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AdaptiveHuffman } from '../../src/algorithms/compression/comp-huffman-adaptive/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-huffman-adaptive/trace.ts';

function roundtrip(data: number[]): void {
  const c = new AdaptiveHuffman();
  const bits = c.encode(data);
  assert.deepEqual(c.decode(bits), data);
}

test('adaptive huffman 往返一致', () => {
  roundtrip([97, 97, 98, 97, 99, 97]);
});

test('adaptive huffman 重复符号后码长更短', () => {
  const c = new AdaptiveHuffman({
    onSymbol: () => {},
  });
  const first = c.encodeSymbol(97);
  c.encodeSymbol(97);
  c.encodeSymbol(97);
  c.encodeSymbol(97);
  const later = c.encodeSymbol(97);
  assert.ok(later.length <= first.length);
});

test('adaptive huffman 多符号往返', () => {
  roundtrip([1, 2, 1, 3, 1, 2, 1, 4, 1]);
});

test('adaptive huffman DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('adaptive huffman 空输入', () => {
  const c = new AdaptiveHuffman();
  assert.equal(c.encode([]), '');
  assert.deepEqual(c.decode(''), []);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
