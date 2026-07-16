import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmp, buildLps } from '../../src/algorithms/string/kmp/impl.ts';

test('kmp 基本行为', () => {
  assert.deepEqual(kmp('ABC', ''), []);
  assert.deepEqual(kmp('ABC', 'ABCDE'), []); // pat 比 text 长
  assert.deepEqual(kmp('A', 'A'), [0]);
  assert.deepEqual(kmp('ABCDEF', 'CD'), [2]);
});

test('kmp 多处匹配（含重叠）', () => {
  // 经典重叠：text="AAAAA" pat="AA" → 起点 0,1,2,3
  assert.deepEqual(kmp('AAAAA', 'AA'), [0, 1, 2, 3]);
  // ABABCABAB 在主串中出现一次
  assert.deepEqual(kmp('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
  // 无匹配
  assert.deepEqual(kmp('HELLO WORLD', 'XYZ'), []);
});

test('kmp 与朴素结果一致', () => {
  // 随机对照朴素算法
  const text = 'abcababcabcaabcabcab';
  const pat = 'abcab';
  const naive: number[] = [];
  for (let i = 0; i + pat.length <= text.length; i++) {
    if (text.slice(i, i + pat.length) === pat) naive.push(i);
  }
  assert.deepEqual(kmp(text, pat), naive);
});

test('buildLps 失败指针正确', () => {
  assert.deepEqual(buildLps('ABABCABAB'), [0, 0, 1, 2, 0, 1, 2, 3, 4]);
  assert.deepEqual(buildLps('AAAA'), [0, 1, 2, 3]);
  assert.deepEqual(buildLps('ABCDE'), [0, 0, 0, 0, 0]);
});

test('kmp 钩子被调用', () => {
  let match = 0;
  let mismatch = 0;
  let found = 0;
  kmp('ABABCABAB', 'ABAB', {
    onMatch: () => match++,
    onMismatch: () => mismatch++,
    onFound: () => found++,
  });
  assert.ok(match > 0, '应触发 onMatch');
  assert.ok(mismatch > 0, '应触发 onMismatch');
  assert.ok(found >= 1, '应至少命中一次');
});
