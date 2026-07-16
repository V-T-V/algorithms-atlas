import { test } from 'node:test';
import assert from 'node:assert/strict';
import { damerauLevenshtein } from '../../src/algorithms/dp/dp-edit-dist-2/impl.ts';

test('damerau 相同串', () => {
  assert.equal(damerauLevenshtein('abc', 'abc'), 0);
});

test('damerau 相邻交换 ca/ac', () => {
  // ca -> ac 仅一次交换，DL=1（普通 Levenshtein=2）
  assert.equal(damerauLevenshtein('ca', 'ac'), 1);
});

test('damerau 普通替换', () => {
  assert.equal(damerauLevenshtein('abc', 'abd'), 1);
});

test('damerau 插入', () => {
  assert.equal(damerauLevenshtein('ab', 'abc'), 1);
});

test('damerau 较复杂', () => {
  // "ca" -> "abc"：交换 ca->ac 后 ac 非 abc 子串，故交换无益，DL=3
  assert.equal(damerauLevenshtein('ca', 'abc'), 3);
});

test('damerau 空串', () => {
  assert.equal(damerauLevenshtein('', 'abc'), 3);
  assert.equal(damerauLevenshtein('abc', ''), 3);
});
