import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashCity32 } from '../../src/algorithms/hashing/hash-city32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-city32/trace.ts';

test('hash-city32 确定性', () => {
  assert.equal(hashCity32('hello'), hashCity32('hello'));
});

test('hash-city32 不同输入不同', () => {
  assert.notEqual(hashCity32('hello'), hashCity32('world'));
});

test('hash-city32 32 位无符号范围', () => {
  const h = hashCity32('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
