import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  affineEncrypt,
  affineDecrypt,
  isValidAffineKey,
} from '../../src/algorithms/crypto/crypto-affine-extended/impl.ts';

test('crypto-affine-extended 加解密往返', () => {
  const s = 'Affine Test 99!';
  const a = 5;
  const b = 8;
  assert.equal(affineDecrypt(affineEncrypt(s, a, b), a, b), s);
});

test('crypto-affine-extended 标准示例', () => {
  // a=3,b=12: A(0)->12=M
  assert.equal(affineEncrypt('A', 3, 12), 'M');
});

test('crypto-affine-extended 非法 a 抛错', () => {
  assert.equal(isValidAffineKey(2), false);
  assert.equal(isValidAffineKey(5), true);
  assert.throws(() => affineEncrypt('A', 2, 1));
});
