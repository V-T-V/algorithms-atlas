import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palindromePartition } from '../../src/algorithms/dp/palindrome-partition/impl.ts';

test('palindrome-partition 基本行为', () => {
  assert.equal(palindromePartition(''), 0);
  assert.equal(palindromePartition('a'), 0);
  assert.equal(palindromePartition('aa'), 0); // 整段回文
  assert.equal(palindromePartition('aba'), 0);
});

test('palindrome-partition 经典用例', () => {
  assert.equal(palindromePartition('aab'), 1); // aa|b
  assert.equal(palindromePartition('aabc'), 2); // aa|b|c
  assert.equal(palindromePartition('ab'), 1); // a|b
  assert.equal(palindromePartition('abcba'), 0); // 整段回文
  assert.equal(palindromePartition('coder'), 4); // c|o|d|e|r，每段单字符
  assert.equal(palindromePartition('leet'), 2); // l|ee|t
});

test('palindrome-partition 全相同字符', () => {
  assert.equal(palindromePartition('aaaaa'), 0);
});

test('palindrome-partition 钩子被调用', () => {
  let pal = 0;
  let fill = 0;
  let done = -1;
  palindromePartition('aab', {
    onPalindrome: () => pal++,
    onFillCell: () => fill++,
    onDone: (c) => {
      done = c;
    },
  });
  assert.ok(pal > 0, '应发现回文');
  assert.ok(fill > 0, '应填 dp');
  assert.equal(done, 1);
});
