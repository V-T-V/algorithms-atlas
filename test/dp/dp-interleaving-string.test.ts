import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isInterleave } from '../../src/algorithms/dp/dp-interleaving-string/impl.ts';

test('interleaving aabcc + dbbca = aadbbcbcac', () => {
  assert.equal(isInterleave('aabcc', 'dbbca', 'aadbbcbcac').interleaving, true);
});

test('interleaving 不匹配示例', () => {
  assert.equal(isInterleave('aabcc', 'dbbca', 'aadbbbaccc').interleaving, false);
});

test('interleaving 空串组合', () => {
  assert.equal(isInterleave('', '', '').interleaving, true);
  assert.equal(isInterleave('a', '', 'a').interleaving, true);
  assert.equal(isInterleave('', 'b', 'b').interleaving, true);
});

test('interleaving 长度不等直接 false', () => {
  assert.equal(isInterleave('a', 'b', 'abc').interleaving, false);
});

test('interleaving 保持顺序', () => {
  // s1=ab, s2=cd, s3=acbd 可，s3=badc 不可（破坏 ab 顺序）
  assert.equal(isInterleave('ab', 'cd', 'acbd').interleaving, true);
  assert.equal(isInterleave('ab', 'cd', 'badc').interleaving, false);
});

test('interleaving 钩子被调用', () => {
  let cells = 0;
  isInterleave('ab', 'cd', 'acbd', { onCell: () => cells++ });
  // (m+1)*(n+1) = 3*3 = 9
  assert.equal(cells, 9);
});
