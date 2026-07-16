import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isAnagram,
  groupAnagrams,
  anagramKey,
  anagramKeyFreq,
} from '../../src/algorithms/string/string-anagram/impl.ts';

test('isAnagram 真', () => {
  assert.equal(isAnagram('listen', 'silent'), true);
  assert.equal(isAnagram('anagram', 'nagaram'), true);
  assert.equal(isAnagram('', ''), true);
  assert.equal(isAnagram('a', 'a'), true);
});

test('isAnagram 假', () => {
  assert.equal(isAnagram('rat', 'car'), false);
  assert.equal(isAnagram('hello', 'world'), false);
  assert.equal(isAnagram('a', 'b'), false);
  assert.equal(isAnagram('ab', 'a'), false); // 长度不同
  assert.equal(isAnagram('aa', 'ab'), false);
});

test('groupAnagrams', () => {
  const groups = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
  assert.equal(groups.length, 3);
  // 每组内部应含相同签名
  for (const g of groups) {
    const key = anagramKey(g[0]!);
    for (const s of g) assert.equal(anagramKey(s), key);
  }
  // 找到 eat/tea/ate 那组
  const eatGroup = groups.find((g) => g.includes('eat'));
  assert.ok(eatGroup);
  assert.equal(eatGroup!.length, 3);
});

test('groupAnagrams 空', () => {
  assert.deepEqual(groupAnagrams([]), []);
});

test('anagramKeyFreq 与 anagramKey 一致分组', () => {
  const strs = ['eat', 'tea', 'ate', 'tan', 'nat'];
  const bySort = new Map<string, number>();
  const byFreq = new Map<string, number>();
  for (const s of strs) {
    const k1 = anagramKey(s);
    const k2 = anagramKeyFreq(s);
    bySort.set(k1, (bySort.get(k1) ?? 0) + 1);
    byFreq.set(k2, (byFreq.get(k2) ?? 0) + 1);
  }
  // 两种签名分组数量相同且每组大小一致
  const sizes1 = [...bySort.values()].sort((a, b) => a - b);
  const sizes2 = [...byFreq.values()].sort((a, b) => a - b);
  assert.deepEqual(sizes1, sizes2);
});

test('isAnagram 大小写敏感', () => {
  assert.equal(isAnagram('Abc', 'abc'), false); // 大小写不同
});
