import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashSuperfast } from '../../src/algorithms/hashing/hash-superfast/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-superfast/trace.ts';

test('hash-superfast 确定性', () => {
  assert.equal(hashSuperfast('hello'), hashSuperfast('hello'));
});

test('hash-superfast 不同输入不同', () => {
  assert.notEqual(hashSuperfast('hello'), hashSuperfast('world'));
});

test('hash-superfast 32 位无符号范围', () => {
  const h = hashSuperfast('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
