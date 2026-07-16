import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashCity64 } from '../../src/algorithms/hashing/hash-city64/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-city64/trace.ts';

test('hash-city64 确定性', () => {
  assert.equal(hashCity64('hello'), hashCity64('hello'));
});

test('hash-city64 不同输入不同', () => {
  assert.notEqual(hashCity64('hello'), hashCity64('world'));
});

test('hash-city64 64 位范围', () => {
  const h = hashCity64('x');
  assert.ok(h >= 0n && h < 1n << 64n);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
