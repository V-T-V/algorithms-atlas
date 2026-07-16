import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashFarm32 } from '../../src/algorithms/hashing/hash-farm32/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-farm32/trace.ts';

test('hash-farm32 确定性', () => {
  assert.equal(hashFarm32('hello'), hashFarm32('hello'));
});

test('hash-farm32 不同输入不同', () => {
  assert.notEqual(hashFarm32('hello'), hashFarm32('world'));
});

test('hash-farm32 32 位无符号范围', () => {
  const h = hashFarm32('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
