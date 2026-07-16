import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashFnv1a64 } from '../../src/algorithms/hashing/hash-fnv1a-64/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-fnv1a-64/trace.ts';

test('hash-fnv1a-64 确定性', () => {
  assert.equal(hashFnv1a64('hello'), hashFnv1a64('hello'));
});

test('hash-fnv1a-64 不同输入不同', () => {
  assert.notEqual(hashFnv1a64('hello'), hashFnv1a64('world'));
});

test('hash-fnv1a-64 64 位范围', () => {
  const h = hashFnv1a64('x');
  assert.ok(h >= 0n && h < 1n << 64n);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
