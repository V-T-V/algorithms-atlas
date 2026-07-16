import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashRipemdImpl } from '../../src/algorithms/hashing/hash-ripemd-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-ripemd-impl/trace.ts';

test('hash-ripemd-impl 确定性', () => {
  assert.deepEqual(hashRipemdImpl('a'), hashRipemdImpl('a'));
});

test('hash-ripemd-impl 不同输入不同', () => {
  assert.notDeepEqual(hashRipemdImpl('a'), hashRipemdImpl('b'));
});

test('hash-ripemd-impl 输出 4 个字', () => {
  assert.equal(hashRipemdImpl('a').length, 4);
});

test('hash-ripemd-impl 空输入有效', () => {
  assert.ok(hashRipemdImpl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
