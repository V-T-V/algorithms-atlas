import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveBits,
  buildJpegTable,
  jpegEncode,
  jpegDecode,
} from '../../src/algorithms/compression/comp-jpeg-huffman/impl.ts';
import {
  buildTrace,
  DEFAULT_FREQ,
} from '../../src/algorithms/compression/comp-jpeg-huffman/trace.ts';

test('jpeg deriveBits + buildJpegTable 往返', () => {
  const freqs = new Map([
    [0, 50],
    [1, 20],
    [2, 15],
    [3, 8],
  ]);
  const { bits, huffval } = deriveBits(freqs);
  const t = buildJpegTable(bits, huffval);
  const syms = [...freqs.keys()].sort((a, b) => a - b);
  const bits2 = jpegEncode(t.codes, syms);
  assert.deepEqual(jpegDecode(t.codes, bits2), syms);
});

test('jpeg 高频符号码长更短', () => {
  const freqs = new Map([
    [0, 100],
    [5, 1],
  ]);
  const { bits, huffval } = deriveBits(freqs);
  const t = buildJpegTable(bits, huffval);
  assert.ok((t.codes.get(0) ?? '').length <= (t.codes.get(5) ?? '').length);
});

test('jpeg BITS 总数 = 符号数', () => {
  const freqs = new Map([
    [0, 5],
    [1, 3],
    [2, 2],
  ]);
  const { bits, huffval } = deriveBits(freqs);
  assert.equal(
    bits.reduce((a, b) => a + b, 0),
    huffval.length,
  );
  assert.equal(huffval.length, 3);
});

test('jpeg 单符号', () => {
  const { bits, huffval } = deriveBits(new Map([[7, 10]]));
  assert.equal(huffval[0], 7);
  const t = buildJpegTable(bits, huffval);
  assert.deepEqual(jpegDecode(t.codes, jpegEncode(t.codes, [7])), [7]);
});

test('jpeg 空表', () => {
  const { bits, huffval } = deriveBits(new Map());
  assert.equal(huffval.length, 0);
  const t = buildJpegTable(bits, huffval);
  assert.equal(t.codes.size, 0);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_FREQ);
  assert.ok(frames.length >= 3);
});
