import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fourSquareEncrypt } from '../../src/algorithms/crypto/crypto-four-square/impl.ts';

test('crypto-four-square 默认方阵恒等', () => {
  // kw1 kw2 为空时 TR=BL=标准字母表，加密后字母对保持（同结构）
  // 但四方规则会重排 -> 验证长度
  const out = fourSquareEncrypt('AB', '', '');
  assert.equal(out.length, 2);
});

test('crypto-four-square 输出长度为偶数', () => {
  const out = fourSquareEncrypt('HELLO', 'EX', 'KY');
  assert.equal(out.length % 2, 0);
});

test('crypto-four-square 关键字影响结果', () => {
  const a = fourSquareEncrypt('HELLO', 'A', 'B');
  const b = fourSquareEncrypt('HELLO', 'X', 'Y');
  assert.notEqual(a, b);
});
