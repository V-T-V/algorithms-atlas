import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPaulHsieh } from '../../src/algorithms/hashing/hash-paul-hsieh/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-paul-hsieh/trace.ts';

test('hash-paul-hsieh 确定性', () => {
  assert.equal(hashPaulHsieh('hello'), hashPaulHsieh('hello'));
});

test('hash-paul-hsieh 不同输入不同', () => {
  assert.notEqual(hashPaulHsieh('hello'), hashPaulHsieh('world'));
});

test('hash-paul-hsieh 32 位无符号范围', () => {
  const h = hashPaulHsieh('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
