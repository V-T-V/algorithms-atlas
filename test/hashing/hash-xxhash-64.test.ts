import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xxh64 } from '../../src/algorithms/hashing/hash-xxhash-64/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-xxhash-64/trace.ts';

test('hash-xxhash-64 确定性', () => {
  assert.equal(xxh64('hello'), xxh64('hello'));
});
test('hash-xxhash-64 不同输入不同', () => {
  assert.notEqual(xxh64('hello'), xxh64('world'));
});
test('hash-xxhash-64 64 位无符号', () => {
  assert.ok(xxh64('abc') >= 0n);
});
test('hash-xxhash-64 空输入', () => {
  assert.ok(xxh64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
