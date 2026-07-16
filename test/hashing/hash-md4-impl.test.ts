import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashMd4Impl } from '../../src/algorithms/hashing/hash-md4-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-md4-impl/trace.ts';

test('hash-md4-impl 确定性', () => {
  assert.deepEqual(hashMd4Impl('a'), hashMd4Impl('a'));
});

test('hash-md4-impl 不同输入不同', () => {
  assert.notDeepEqual(hashMd4Impl('a'), hashMd4Impl('b'));
});

test('hash-md4-impl 输出 4 个字', () => {
  assert.equal(hashMd4Impl('a').length, 4);
});

test('hash-md4-impl 空输入有效', () => {
  assert.ok(hashMd4Impl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
