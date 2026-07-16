import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rabinKarp } from '../../src/algorithms/string/rabin-karp/impl.ts';

test('rabin-karp 基本行为', () => {
  assert.deepEqual(rabinKarp('ABC', ''), []); // 空模式
  assert.deepEqual(rabinKarp('ABC', 'ABCDE'), []); // pat 比 text 长
  assert.deepEqual(rabinKarp('A', 'A'), [0]);
  assert.deepEqual(rabinKarp('ABCDEF', 'CD'), [2]);
});

test('rabin-karp 多处匹配（含重叠）', () => {
  assert.deepEqual(rabinKarp('AAAAA', 'AA'), [0, 1, 2, 3]);
  assert.deepEqual(rabinKarp('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(rabinKarp('GEEKS FOR GEEKS', 'GEEK'), [0, 10]);
  assert.deepEqual(rabinKarp('HELLO WORLD', 'XYZ'), []);
});

test('rabin-karp 与朴素结果一致', () => {
  const text = 'abcababcabcaabcabcab';
  const pat = 'abcab';
  const naive: number[] = [];
  for (let i = 0; i + pat.length <= text.length; i++) {
    if (text.slice(i, i + pat.length) === pat) naive.push(i);
  }
  assert.deepEqual(rabinKarp(text, pat), naive);
});

test('rabin-karp 长串仍正确（哈希取模）', () => {
  // 重复很长，确保滚动取模不丢匹配
  const text = 'ab'.repeat(500);
  const pat = 'ab'.repeat(10);
  const ref = rabinKarp(text, pat);
  assert.ok(ref.length > 0);
  for (const s of ref) assert.equal(text.slice(s, s + pat.length), pat);
});

test('rabin-karp 钩子被调用', () => {
  let patHash = -1;
  let roll = 0;
  let verify = 0;
  let found = 0;
  rabinKarp('GEEKS FOR GEEKS', 'GEEK', {
    onPatHash: (h) => (patHash = h),
    onRoll: () => roll++,
    onVerify: () => verify++,
    onFound: () => found++,
  });
  assert.ok(patHash >= 0, '应算出模式哈希');
  assert.ok(roll > 0, '应多次滚动');
  assert.ok(verify >= 2, 'GEEK 出现 2 次应校验');
  assert.equal(found, 2);
});

test('rabin-karp 碰撞靠逐字校验过滤', () => {
  // 不同串哈希也可能相等；保证结果不被误判
  const r = rabinKarp('ABCDWXYZ', 'ABCD');
  assert.deepEqual(r, [0]);
});
