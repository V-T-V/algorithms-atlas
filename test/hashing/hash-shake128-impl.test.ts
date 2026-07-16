import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashShake128Impl } from '../../src/algorithms/hashing/hash-shake128-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-shake128-impl/trace.ts';

test('hash-shake128-impl 确定性', () => {
  assert.deepEqual(hashShake128Impl('a'), hashShake128Impl('a'));
});

test('hash-shake128-impl 不同输入不同', () => {
  assert.notDeepEqual(hashShake128Impl('a'), hashShake128Impl('b'));
});

test('hash-shake128-impl 输出 4 个字', () => {
  assert.equal(hashShake128Impl('a').length, 4);
});

test('hash-shake128-impl 空输入有效', () => {
  assert.ok(hashShake128Impl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
