import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  polybiusEncrypt,
  buildPolybiusSquare,
} from '../../src/algorithms/crypto/crypto-polybius-extended/impl.ts';

test('crypto-polybius-extended 方阵构造', () => {
  const cells = buildPolybiusSquare('');
  // 不含 J（I/J 合并）
  assert.equal(cells.length, 25);
  assert.ok(!cells.includes('J'));
});

test('crypto-polybius-extended 标准加密', () => {
  // 默认方阵：A=11 B=12 ... ；H 在 row2 col3 = 23
  // H(23) E(15) L(31) P(35)
  assert.equal(polybiusEncrypt('HELP'), '23153135');
});

test('crypto-polybius-extended IJ 合并', () => {
  // I=24, J 也映射为 I 的坐标 24
  assert.equal(polybiusEncrypt('IJ'), '2424');
});

test('crypto-polybius-extended 关键字打乱', () => {
  // 关键字 ZEUS：Z=11, E=12, U=13, S=14, 然后 A B C D F...
  assert.equal(polybiusEncrypt('Z', 'ZEUS'), '11');
});
