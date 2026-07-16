import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  manacher,
  countPalindromes,
} from '../../src/algorithms/string/palindrome-tree-manacher/impl.ts';

test('manacher babad 最长回文', () => {
  const { start, length } = manacher('babad');
  assert.equal(length, 3);
  assert.equal(start, 0); // "bab"
});

test('manacher cbbd 最长回文', () => {
  const { length, start } = manacher('cbbd');
  assert.equal(length, 2);
  assert.equal('cbbd'.slice(start, start + length), 'bb');
});

test('manacher 整串回文', () => {
  const { start, length } = manacher('racecar');
  assert.equal(length, 7);
  assert.equal(start, 0);
});

test('manacher 单字符', () => {
  const { length } = manacher('a');
  assert.equal(length, 1);
});

test('manacher 空串', () => {
  const { length } = manacher('');
  assert.equal(length, 0);
});

test('manacher 偶数回文 aaaa', () => {
  const { length } = manacher('aaaa');
  assert.equal(length, 4);
});

test('countPalindromes 计数', () => {
  // "aaa": 回文子串 a,a,a,aa,aa,aaa = 6
  assert.equal(countPalindromes('aaa'), 6);
  // "abc": a,b,c = 3
  assert.equal(countPalindromes('abc'), 3);
});

test('manacher 与朴素对照', () => {
  const isPal = (s: string): boolean => s === [...s].reverse().join('');
  const naive = (s: string): number => {
    let best = 0;
    for (let i = 0; i < s.length; i++) {
      for (let j = i + 1; j <= s.length; j++) {
        if (isPal(s.slice(i, j)) && j - i > best) best = j - i;
      }
    }
    return best;
  };
  for (const s of ['abacaba', 'aabbaa', 'xyz', 'abbc', 'bananas']) {
    assert.equal(manacher(s).length, naive(s), s);
  }
});
