import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rot47 } from '../../src/algorithms/crypto/crypto-rot47/impl.ts';

test('crypto-rot47 自反', () => {
  const s = 'Hello, World! 123';
  assert.equal(rot47(rot47(s)), s);
});

test('crypto-rot47 标准示例', () => {
  // 'H'(72) -> 72-33+47=86 % 94 +33 = 119 = 'w'
  assert.equal(rot47('Hello'), 'w6==@');
});

test('crypto-rot47 空格保留', () => {
  // 空格(32) 在 33-126 区间外，原样保留
  assert.equal(rot47(' '), ' ');
  assert.equal(rot47('\t'), '\t');
});
