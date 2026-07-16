import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashShake256Impl } from '../../src/algorithms/hashing/hash-shake256-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-shake256-impl/trace.ts';

test('hash-shake256-impl 确定性', () => {
  assert.deepEqual(hashShake256Impl('a'), hashShake256Impl('a'));
});

test('hash-shake256-impl 不同输入不同', () => {
  assert.notDeepEqual(hashShake256Impl('a'), hashShake256Impl('b'));
});

test('hash-shake256-impl 输出 4 个字', () => {
  assert.equal(hashShake256Impl('a').length, 4);
});

test('hash-shake256-impl 空输入有效', () => {
  assert.ok(hashShake256Impl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
