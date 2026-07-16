import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hybridEncode,
  hybridDecode,
} from '../../src/algorithms/compression/comp-huffman-arithmetic/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-huffman-arithmetic/trace.ts';

function roundtrip(d: number[]): void {
  const r = hybridEncode(d, 3);
  assert.deepEqual(hybridDecode(r, r.bitstream, d.length), d);
}

test('hybrid 往返一致', () => {
  roundtrip([97, 97, 97, 97, 98, 98, 99, 99, 100, 101, 102]);
});

test('hybrid 高频符号走 huffman', () => {
  const r = hybridEncode([97, 97, 97, 98, 99, 100], 2);
  assert.ok(r.huffmanSyms.has(97));
});

test('hybrid 空输入', () => {
  const r = hybridEncode([], 3);
  assert.equal(r.bitstream, '');
  assert.deepEqual(hybridDecode(r, r.bitstream, 0), []);
});

test('hybrid DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
