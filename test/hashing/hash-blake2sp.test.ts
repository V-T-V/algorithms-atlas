import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashBlake2sp } from '../../src/algorithms/hashing/hash-blake2sp/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-blake2sp/trace.ts';
test('blake2sp 确定性', () => {
  assert.equal(hashBlake2sp('a'), hashBlake2sp('a'));
});
test('blake2sp 不同输入不同', () => {
  assert.notEqual(hashBlake2sp('a'), hashBlake2sp('b'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
