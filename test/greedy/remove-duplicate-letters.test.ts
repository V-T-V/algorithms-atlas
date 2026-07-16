import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  removeDuplicateLetters,
  type RemoveDuplicateLettersHooks,
} from '../../src/algorithms/greedy/remove-duplicate-letters/impl.ts';

test('remove-duplicate-letters "bcabc" = "abc"', () => {
  // LeetCode 示例 1
  assert.equal(removeDuplicateLetters('bcabc').value, 'abc');
});

test('remove-duplicate-letters "cbacdcbc" = "acdb"', () => {
  // LeetCode 示例 2
  assert.equal(removeDuplicateLetters('cbacdcbc').value, 'acdb');
});

test('remove-duplicate-letters 无重复', () => {
  assert.equal(removeDuplicateLetters('abcd').value, 'abcd');
  assert.equal(removeDuplicateLetters('a').value, 'a');
});

test('remove-duplicate-letters 空串', () => {
  assert.equal(removeDuplicateLetters('').value, '');
});

test('remove-duplicate-letters 全相同', () => {
  assert.equal(removeDuplicateLetters('aaaa').value, 'a');
});

test('remove-duplicate-letters 结果每个字符恰好一次', () => {
  const cases = ['bcabc', 'cbacdcbc', 'abacb', 'bbcab'];
  for (const s of cases) {
    const r = removeDuplicateLetters(s).value;
    const uniq = new Set(r);
    assert.equal(uniq.size, r.length, '结果应无重复');
    assert.equal(uniq.size, new Set(s).size, '去重后字符种类应一致');
  }
});

test('remove-duplicate-letters 结果字符是源串子序列', () => {
  const cases = ['bcabc', 'cbacdcbc', 'abacb'];
  for (const s of cases) {
    const r = removeDuplicateLetters(s).value;
    let j = 0;
    for (let i = 0; i < s.length && j < r.length; i++) {
      if (s[i] === r[j]) j++;
    }
    assert.equal(j, r.length, '结果应为源串子序列');
  }
});

test('remove-duplicate-letters 钩子被调用', () => {
  let pushes = 0;
  let pops = 0;
  const hooks: RemoveDuplicateLettersHooks = {
    onPush: () => pushes++,
    onPop: () => pops++,
  };
  removeDuplicateLetters('bcabc', hooks);
  assert.ok(pushes > 0);
});

test('remove-duplicate-letters 与 smallest-subsequence 等价', () => {
  // 同一算法的不同描述，结果一致
  assert.equal(removeDuplicateLetters('cdadabcc').value, 'adbc');
});
