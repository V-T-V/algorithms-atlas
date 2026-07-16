import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashRipemd160Impl } from '../../src/algorithms/hashing/hash-ripemd160-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-ripemd160-impl/trace.ts';

test('hash-ripemd160-impl 确定性', () => {
  assert.deepEqual(hashRipemd160Impl('a'), hashRipemd160Impl('a'));
});

test('hash-ripemd160-impl 不同输入不同', () => {
  assert.notDeepEqual(hashRipemd160Impl('a'), hashRipemd160Impl('b'));
});

test('hash-ripemd160-impl 输出 4 个字', () => {
  assert.equal(hashRipemd160Impl('a').length, 4);
});

test('hash-ripemd160-impl 空输入有效', () => {
  assert.ok(hashRipemd160Impl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
