import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xxh3_64 } from '../../src/algorithms/hashing/hash-xxhash-3/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-xxhash-3/trace.ts';

test('hash-xxhash-3 确定性', () => {
  assert.equal(xxh3_64('hello'), xxh3_64('hello'));
});
test('hash-xxhash-3 不同输入不同', () => {
  assert.notEqual(xxh3_64('hello'), xxh3_64('world'));
});
test('hash-xxhash-3 空输入', () => {
  assert.ok(xxh3_64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
