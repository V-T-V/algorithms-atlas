import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestPalindrome } from '../../src/algorithms/dp/longest-palindrome/impl.ts';

// 校验：答案本身是回文，且长度等于「最长回文长度」
function isPalindrome(t: string): boolean {
  return t === [...t].reverse().join('');
}

test('longest-palindrome 经典 babad', () => {
  const r = longestPalindrome('babad');
  assert.equal(r.length, 3);
  assert.ok(isPalindrome(r), '答案应是回文');
  assert.ok(r === 'bab' || r === 'aba');
});

test('longest-palindrome 经典 cbbd → bb', () => {
  assert.equal(longestPalindrome('cbbd'), 'bb');
});

test('longest-palindrome 整串即回文', () => {
  assert.equal(longestPalindrome('racecar'), 'racecar');
  assert.equal(longestPalindrome('abba'), 'abba');
  assert.equal(longestPalindrome('a'), 'a');
});

test('longest-palindrome 空串 / 单字符', () => {
  assert.equal(longestPalindrome(''), '');
  assert.equal(longestPalindrome('x'), 'x');
});

test('longest-palindrome 无重复字符 → 任取一个', () => {
  const r = longestPalindrome('abc');
  assert.equal(r.length, 1);
  assert.ok(isPalindrome(r));
});

test('longest-palindrome 全相同字符', () => {
  assert.equal(longestPalindrome('aaaa'), 'aaaa');
  assert.equal(longestPalindrome('aaa'), 'aaa');
});

test('longest-palindrome 回文在中部', () => {
  assert.equal(longestPalindrome('xyzracecarabc'), 'racecar');
  assert.equal(longestPalindrome('123abba456'), 'abba');
});

test('longest-palindrome 多个等长回文取其一', () => {
  // "aacabdkacaa" 没有 aaca 的回文；最长是 aacaa... 不对
  // 用更确定的：abacdfgdcaba —— 整体不是；中间 acdfgdc a 是 acdfgdca? 测一个清晰的
  const r = longestPalindrome('abacaba');
  assert.ok(isPalindrome(r));
  assert.equal(r.length, 7); // 整串就是回文
});

test('longest-palindrome 答案必是回文', () => {
  const cases = ['babad', 'cbbd', 'racecar', 'abcdef', 'aabbaa', 'bananas'];
  for (const s of cases) {
    const r = longestPalindrome(s);
    assert.ok(isPalindrome(r), `"${r}" 不是回文（输入 "${s}"）`);
  }
});

test('longest-palindrome 长度等于暴力最长', () => {
  // 暴力：枚举所有子串，取最长回文
  function brute(s: string): number {
    let best = 0;
    for (let i = 0; i < s.length; i++) {
      for (let j = i; j < s.length; j++) {
        const sub = s.slice(i, j + 1);
        if (isPalindrome(sub)) best = Math.max(best, sub.length);
      }
    }
    return best;
  }
  const cases = ['babad', 'cbbd', 'racecar', 'abcdef', 'aabbaa', 'bananas', 'abcdcba', 'xyz'];
  for (const s of cases) {
    const r = longestPalindrome(s);
    assert.equal(r.length, brute(s), `输入 "${s}" 长度不一致`);
  }
});

test('longest-palindrome 钩子被调用', () => {
  let checks = 0;
  let pals = 0;
  let updates = 0;
  longestPalindrome('babad', {
    onCheck: (_i, _j, isPal) => {
      checks++;
      if (isPal) pals++;
    },
    onUpdateBest: () => updates++,
  });
  assert.ok(checks > 0, '应触发判定');
  assert.ok(pals > 0, '至少有一个回文');
  assert.ok(updates > 0, '应更新最优');
});

test('longest-palindrome 单字符触发钩子', () => {
  let checks = 0;
  longestPalindrome('a', {
    onCheck: () => checks++,
  });
  assert.equal(checks, 1);
});
