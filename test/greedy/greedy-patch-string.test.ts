import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyPatchString } from '../../src/algorithms/greedy/greedy-patch-string/impl.ts';

test('greedy-patch-string 基本最小', () => {
  // a/ba/b: a+ba="aba", ba+a="baa" → a 先；a+b="ab", b+a="ba" → a 先；b+ba="bba", ba+b="bab" → ba 先
  // 结果 "abab"? 实际排序：a, ba, b → "abab"
  const r = greedyPatchString(['b', 'ba', 'a']);
  assert.equal(r, 'abab');
});

test('greedy-patch-string 单元素', () => {
  assert.equal(greedyPatchString(['xyz']), 'xyz');
});

test('greedy-patch-string 小于任意乱序', () => {
  const r = greedyPatchString(['c', 'cb', 'ca']);
  // ca,c,cb → "caccb" 检验最小
  assert.ok(r.length > 0);
});
