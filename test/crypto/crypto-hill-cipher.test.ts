import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hillEncrypt,
  hillDecrypt,
  isHillKeyValid,
} from '../../src/algorithms/crypto/crypto-hill-cipher/impl.ts';

test('crypto-hill-cipher 密钥合法性', () => {
  // [[3,3],[2,5]] det=15-6=9, gcd(9,26)=1 -> 合法
  assert.equal(isHillKeyValid(3, 3, 2, 5), true);
  // [[1,1],[1,1]] det=0 -> 非法
  assert.equal(isHillKeyValid(1, 1, 1, 1), false);
});

test('crypto-hill-cipher 加解密往返', () => {
  const s = 'HELLO';
  const key = [3, 3, 2, 5] as const;
  assert.equal(hillDecrypt(hillEncrypt(s, key), key), 'HELLOX');
});

test('crypto-hill-cipher 单位矩阵恒等', () => {
  // [[1,0],[0,1]] 应保持明文（补 X）
  assert.equal(hillEncrypt('HI', [1, 0, 0, 1]), 'HI');
});

test('crypto-hill-cipher 非法密钥抛错', () => {
  assert.throws(() => hillEncrypt('A', [1, 1, 1, 1]));
});
