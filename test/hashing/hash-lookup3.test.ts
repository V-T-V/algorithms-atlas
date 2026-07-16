import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashLookup3 } from '../../src/algorithms/hashing/hash-lookup3/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-lookup3/trace.ts';

test('hash-lookup3 确定性', () => {
  assert.equal(hashLookup3('hello'), hashLookup3('hello'));
});

test('hash-lookup3 不同输入不同', () => {
  assert.notEqual(hashLookup3('hello'), hashLookup3('world'));
});

test('hash-lookup3 32 位无符号范围', () => {
  const h = hashLookup3('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
