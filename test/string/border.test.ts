import { test } from 'node:test';
import assert from 'node:assert/strict';
import { border, allBorders } from '../../src/algorithms/string/border/impl.ts';

test('border 基本 border 数组', () => {
  // 与 KMP 前缀函数一致
  assert.deepEqual(border('ABABCABAB'), [0, 0, 1, 2, 0, 1, 2, 3, 4]);
  assert.deepEqual(border('AAAA'), [0, 1, 2, 3]);
  assert.deepEqual(border('abcde'), [0, 0, 0, 0, 0]);
  assert.deepEqual(border('aabaab'), [0, 1, 0, 1, 2, 3]);
});

test('border 空串与单字符', () => {
  assert.deepEqual(border(''), []);
  assert.deepEqual(border('x'), [0]);
});

test('border 钩子被调用', () => {
  let sets = 0;
  border('AABAACAABAA', {
    onSet: () => sets++,
  });
  assert.ok(sets > 0);
});

test('allBorders 列出所有 border', () => {
  const b = border('aaa'); // [0,1,2]
  // pat[0..2]='aaa' 的 border 长度：2（'aa'），1（'a'）
  assert.deepEqual(allBorders(b, 2), [2, 1]);
  // 'aabaabaaaab' 较长串
  const b2 = border('aabaabaaaab');
  // pat[0..10] 最长 border = 'aa' 长度？实际算
  const top = b2[10];
  assert.ok(top! > 0);
});
