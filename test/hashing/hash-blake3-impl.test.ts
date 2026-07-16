import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashBlake3Impl } from '../../src/algorithms/hashing/hash-blake3-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-blake3-impl/trace.ts';

test('hash-blake3-impl 确定性', () => {
  assert.deepEqual(hashBlake3Impl('a'), hashBlake3Impl('a'));
});

test('hash-blake3-impl 不同输入不同', () => {
  assert.notDeepEqual(hashBlake3Impl('a'), hashBlake3Impl('b'));
});

test('hash-blake3-impl 输出 4 个字', () => {
  assert.equal(hashBlake3Impl('a').length, 4);
});

test('hash-blake3-impl 空输入有效', () => {
  assert.ok(hashBlake3Impl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
