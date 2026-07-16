import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  brotliCompress,
  brotliDecompress,
  STATIC_DICT,
} from '../../src/algorithms/compression/comp-brotli-simple/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/compression/comp-brotli-simple/trace.ts';

function roundtrip(d: number[]): void {
  const toks = brotliCompress(d, STATIC_DICT);
  assert.deepEqual(brotliDecompress(toks, STATIC_DICT), d);
}

test('brotli 简化 往返一致', () => {
  roundtrip([104, 116, 116, 112, 58, 47, 47, 104, 116, 109, 108]);
});

test('brotli 简化 字典命中', () => {
  const toks = brotliCompress([104, 116, 116, 112, 58], STATIC_DICT);
  assert.ok(toks.some((t) => t.isMatch && t.fromDict));
});

test('brotli 简化 空输入', () => {
  assert.deepEqual(brotliCompress([], STATIC_DICT), []);
  assert.deepEqual(brotliDecompress([], STATIC_DICT), []);
});

test('brotli 简化 DEFAULT_INPUT 往返', () => {
  roundtrip(DEFAULT_INPUT);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
