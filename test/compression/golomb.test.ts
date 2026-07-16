import { test } from 'node:test';
import assert from 'node:assert/strict';
import { golomb } from '../../src/algorithms/compression/golomb/impl.ts';

test('golomb：m=10 时 0 的编码', () => {
  // q=0 → '0'；b=floor(log2(10))=3, cutoff=6；r=0<6 → 3 位 '000'
  assert.equal(golomb([0], 10).bits, '0000');
});

test('golomb：多值拼接', () => {
  assert.equal(golomb([0, 0], 10).bits, '00000000');
});

test('golomb：负数或非法 m 抛错', () => {
  assert.throws(() => golomb([-1], 10));
  assert.throws(() => golomb([0], 0));
});
