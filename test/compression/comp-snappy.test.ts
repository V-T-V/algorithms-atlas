import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  snappyCompress,
  snappyDecompress,
} from '../../src/algorithms/compression/comp-snappy/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/comp-snappy/trace.ts';

function roundtrip(data: number[]): void {
  const toks = snappyCompress(data, { windowSize: 16, minMatch: 4, maxMatch: 64 });
  const restored = snappyDecompress(toks);
  assert.deepEqual(restored, data);
}

test('snappy 往返一致', () => {
  roundtrip([1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4]);
});

test('snappy 全字面量', () => {
  const toks = snappyCompress([1, 2, 3, 4, 5], { windowSize: 16, minMatch: 4, maxMatch: 64 });
  assert.deepEqual(snappyDecompress(toks), [1, 2, 3, 4, 5]);
});

test('snappy 空输入', () => {
  assert.deepEqual(snappyCompress([]), []);
  assert.deepEqual(snappyDecompress([]), []);
});

test('snappy 往返一致：DEFAULT_INPUT', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
