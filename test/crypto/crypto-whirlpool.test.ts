import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whirlpool } from '../../src/algorithms/crypto/crypto-whirlpool/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-whirlpool/trace.ts';

test('whirlpool 输出 32 字节', () => {
  assert.equal(whirlpool([1, 2, 3]).length, 32);
});
test('whirlpool 确定性', () => {
  assert.deepEqual(whirlpool([1, 2, 3]), whirlpool([1, 2, 3]));
});
test('whirlpool 雪崩', () => {
  const a = whirlpool([1, 2, 3]);
  const b = whirlpool([1, 2, 4]);
  assert.ok(a.some((v, i) => v !== b[i]));
});
test('whirlpool trace 非空', () => assert.ok(buildTrace().length > 0));
