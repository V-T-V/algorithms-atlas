import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashMurmur2a } from '../../src/algorithms/hashing/hash-murmur2a/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-murmur2a/trace.ts';

test('hash-murmur2a 确定性', () => {
  assert.equal(hashMurmur2a('hello'), hashMurmur2a('hello'));
});

test('hash-murmur2a 不同输入不同', () => {
  assert.notEqual(hashMurmur2a('hello'), hashMurmur2a('world'));
});

test('hash-murmur2a 32 位无符号范围', () => {
  const h = hashMurmur2a('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
