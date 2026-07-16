import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  zstdCompress,
  zstdDecompress,
} from '../../src/algorithms/compression/comp-zstd-simple/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-zstd-simple/trace.ts';

function roundtrip(d: number[]): void {
  const toks = zstdCompress(d, { windowSize: 16, minMatch: 3, maxMatch: 32 });
  assert.deepEqual(zstdDecompress(toks), d);
}

test('zstd 简化 往返一致', () => {
  roundtrip([1, 2, 3, 1, 2, 3, 1, 2, 3]);
});

test('zstd 简化 全字面量', () => {
  const toks = zstdCompress([5, 4, 3, 2, 1], { windowSize: 16, minMatch: 3, maxMatch: 32 });
  assert.deepEqual(zstdDecompress(toks), [5, 4, 3, 2, 1]);
});

test('zstd 简化 空输入', () => {
  assert.deepEqual(zstdCompress([]), []);
  assert.deepEqual(zstdDecompress([]), []);
});

test('zstd 简化 DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
