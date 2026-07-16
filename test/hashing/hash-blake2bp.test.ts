import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashBlake2bp } from '../../src/algorithms/hashing/hash-blake2bp/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-blake2bp/trace.ts';
test('blake2bp 确定性', () => {
  assert.equal(hashBlake2bp('a'), hashBlake2bp('a'));
});
test('blake2bp 不同输入不同', () => {
  assert.notEqual(hashBlake2bp('a'), hashBlake2bp('b'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
