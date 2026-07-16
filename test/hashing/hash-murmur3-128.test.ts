import { test } from 'node:test';
import assert from 'node:assert/strict';
import { murmur3_128, murmur3_128Hex } from '../../src/algorithms/hashing/hash-murmur3-128/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-murmur3-128/trace.ts';

test('murmur3-128 确定性', () => {
  assert.deepEqual(murmur3_128('hello'), murmur3_128('hello'));
});

test('murmur3-128 不同输入不同', () => {
  assert.notDeepEqual(murmur3_128('hello'), murmur3_128('world'));
});

test('murmur3-128 种子影响输出', () => {
  assert.notDeepEqual(murmur3_128('hello', 0n), murmur3_128('hello', 1n));
});

test('murmur3-128 hex 确定性', () => {
  assert.equal(murmur3_128Hex('hello'), murmur3_128Hex('hello'));
  assert.equal(murmur3_128Hex('hello').length, 32);
});

test('murmur3-128 空输入', () => {
  const r = murmur3_128('');
  assert.ok(r.h1 >= 0n);
  assert.ok(r.h2 >= 0n);
});

test('murmur3-128 长输入', () => {
  const r = murmur3_128('The quick brown fox jumps over the lazy dog');
  assert.ok(r.h1 >= 0n);
  assert.ok(r.h2 >= 0n);
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
