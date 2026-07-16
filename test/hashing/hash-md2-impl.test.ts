import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashMd2Impl } from '../../src/algorithms/hashing/hash-md2-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-md2-impl/trace.ts';

test('hash-md2-impl 确定性', () => {
  assert.deepEqual(hashMd2Impl('a'), hashMd2Impl('a'));
});

test('hash-md2-impl 不同输入不同', () => {
  assert.notDeepEqual(hashMd2Impl('a'), hashMd2Impl('b'));
});

test('hash-md2-impl 输出 4 个字', () => {
  assert.equal(hashMd2Impl('a').length, 4);
});

test('hash-md2-impl 空输入有效', () => {
  assert.ok(hashMd2Impl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
