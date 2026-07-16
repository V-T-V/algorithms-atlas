import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lz4Compress, lz4Decompress } from '../../src/algorithms/compression/comp-lz4/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/comp-lz4/trace.ts';

function roundtrip(data: number[]): void {
  const toks = lz4Compress(data, { windowSize: 12, minMatch: 3, maxMatch: 33 });
  const restored = lz4Decompress(toks, 3);
  assert.deepEqual(restored, data);
}

test('lz4 往返一致：重复模式', () => {
  roundtrip([1, 2, 3, 1, 2, 3, 1, 2, 3, 4, 5]);
});

test('lz4 往返一致：长重复', () => {
  roundtrip(Array.from({ length: 30 }, (_, i) => i % 5));
});

test('lz4 全字面量', () => {
  const toks = lz4Compress([1, 2, 3, 4, 5], { windowSize: 12, minMatch: 3, maxMatch: 33 });
  assert.deepEqual(lz4Decompress(toks, 3), [1, 2, 3, 4, 5]);
});

test('lz4 空输入', () => {
  assert.deepEqual(lz4Compress([]), []);
  assert.deepEqual(lz4Decompress([], 3), []);
});

test('lz4 往返一致：Hello World 模式', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux);
});
