import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btBraceExpansion2 } from '../../src/algorithms/backtracking/bt-brace-expansion-2/impl.ts';

test('bt-brace-expansion-2 {a,b}{c,{d,e}}', () => {
  assert.deepEqual(btBraceExpansion2('{a,b}{c,{d,e}}'), ['ac', 'ad', 'ae', 'bc', 'bd', 'be']);
});

test('bt-brace-expansion-2 {a,b}{c,{d,e}} 数量正确', () => {
  const res = btBraceExpansion2('{a,b}{c,{d,e}}');
  assert.equal(res.length, 6);
});

test('bt-brace-expansion-2 嵌套', () => {
  const res = btBraceExpansion2('{a,{b,c}}');
  assert.deepEqual(res, ['a', 'b', 'c']);
});

test('bt-brace-expansion-2 无花括号', () => {
  assert.deepEqual(btBraceExpansion2('abc'), ['abc']);
});

test('bt-brace-expansion-2 结果去重升序', () => {
  const res = btBraceExpansion2('{a,b}{b,a}');
  for (let i = 1; i < res.length; i++) assert.ok(res[i]! >= res[i - 1]!);
  assert.equal(new Set(res).size, res.length);
});
