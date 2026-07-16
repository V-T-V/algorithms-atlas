import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  brotliEntropyEncode,
  brotliEntropyDecode,
} from '../../src/algorithms/compression/comp-brotli-entropy/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-brotli-entropy/trace.ts';

function roundtrip(d: number[]): void {
  const { codes, bitstream } = brotliEntropyEncode(d);
  assert.deepEqual(brotliEntropyDecode(codes, bitstream), d);
}

test('brotli 熵编码 往返一致', () => {
  roundtrip([97, 97, 97, 98, 98, 99, 99, 99, 99, 100]);
});

test('brotli 熵编码 高频符号码长短', () => {
  const { codes } = brotliEntropyEncode([97, 97, 97, 97, 97, 98]);
  assert.ok((codes.get(97) ?? '').length <= (codes.get(98) ?? '').length);
});

test('brotli 熵编码 单符号', () => {
  const { codes, bitstream } = brotliEntropyEncode([97, 97, 97]);
  assert.deepEqual(brotliEntropyDecode(codes, bitstream), [97, 97, 97]);
});

test('brotli 熵编码 空输入', () => {
  const { codes, bitstream } = brotliEntropyEncode([]);
  assert.equal(bitstream, '');
  assert.deepEqual(brotliEntropyDecode(codes, bitstream), []);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
