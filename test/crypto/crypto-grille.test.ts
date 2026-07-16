import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grilleEncrypt } from '../../src/algorithms/crypto/crypto-grille/impl.ts';

test('crypto-grille 输出长度 16', () => {
  const out = grilleEncrypt('ABCDEFGHIJKLMNOP');
  assert.equal(out.length, 16);
});

test('crypto-grille 含全部输入字符', () => {
  const out = grilleEncrypt('ABCDEFGHIJKLMNOP');
  // 16 个不同字母全部应出现（顺序被打乱）
  const sorted = out.split('').sort().join('');
  assert.equal(sorted, 'ABCDEFGHIJKLMNOP');
});

test('crypto-grille 不足补 X', () => {
  const out = grilleEncrypt('AB');
  assert.equal(out.length, 16);
  assert.equal(out.split('').filter((c) => c === 'X').length, 14);
});
