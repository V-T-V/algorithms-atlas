import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPalindrome } from '../../src/algorithms/misc/is-palindrome/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/is-palindrome/trace.ts';

test('is-palindrome 简单回文', () => {
  assert.equal(isPalindrome('racecar'), true);
  assert.equal(isPalindrome('level'), true);
  assert.equal(isPalindrome('noon'), true);
  assert.equal(isPalindrome('a'), true);
  assert.equal(isPalindrome(''), true);
});

test('is-palindrome 非回文', () => {
  assert.equal(isPalindrome('hello'), false);
  assert.equal(isPalindrome('abc'), false);
  assert.equal(isPalindrome('ab'), false);
});

test('is-palindrome 区分大小写（默认）', () => {
  assert.equal(isPalindrome('Racecar'), false);
  assert.equal(isPalindrome('Aa'), false);
});

test('is-palindrome 规范化模式', () => {
  // 转小写 + 忽略非字母数字
  assert.equal(isPalindrome('Racecar', {}, { normalize: true }), true);
  assert.equal(isPalindrome('A man, a plan, a canal: Panama', {}, { normalize: true }), true);
  assert.equal(isPalindrome('Was it a car or a cat I saw?', {}, { normalize: true }), true);
});

test('is-palindrome 规范化不影响非回文', () => {
  assert.equal(isPalindrome('hello', {}, { normalize: true }), false);
});

test('is-palindrome 偶数长度', () => {
  assert.equal(isPalindrome('abba'), true);
  assert.equal(isPalindrome('abca'), false);
});

test('is-palindrome 钩子被调用', () => {
  const matches: Array<[number, number]> = [];
  let result = -1;
  isPalindrome('abba', {
    onMatch: (l, r) => matches.push([l, r]),
    onResult: (ok) => (result = ok ? 1 : 0),
  });
  // abba: 比较 (0,3) 匹配, (1,2) 匹配
  assert.deepEqual(matches, [
    [0, 3],
    [1, 2],
  ]);
  assert.equal(result, 1);
});

test('is-palindrome 不匹配时立即停止', () => {
  let mismatches = 0;
  let compares = 0;
  const ok = isPalindrome('abc', {
    onCompare: () => compares++,
    onMismatch: () => mismatches++,
  });
  assert.equal(ok, false);
  // abc: 比较 (0,2) 不匹配即停
  assert.equal(compares, 1);
  assert.equal(mismatches, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
  const result = last.aux!.find((e) => e.label === '结果');
  assert.ok(result);
  assert.ok(result!.value.includes('回文'));
});

test('buildTrace 非回文标记 warn', () => {
  const frames = buildTrace('hello');
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === '结果');
  assert.ok(result!.value.includes('非回文'));
  // 中间应出现 warn 角色
  const hasWarn = frames.some((f) => f.array?.roles?.some((r) => r === 'warn'));
  assert.ok(hasWarn, '应有 warn 角色标记不匹配');
});
