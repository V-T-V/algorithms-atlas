import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashMurmur2 } from '../../src/algorithms/hashing/hash-murmur2/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-murmur2/trace.ts';

test('hash-murmur2 确定性', () => {
  assert.equal(hashMurmur2('hello'), hashMurmur2('hello'));
});

test('hash-murmur2 不同输入不同', () => {
  assert.notEqual(hashMurmur2('hello'), hashMurmur2('world'));
});

test('hash-murmur2 32 位无符号范围', () => {
  const h = hashMurmur2('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
