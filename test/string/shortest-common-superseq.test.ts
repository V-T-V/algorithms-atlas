import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestCommonSuperseq } from '../../src/algorithms/string/shortest-common-superseq/impl.ts';

const isSubseq = (sup: string, sub: string): boolean => {
  let i = 0;
  for (const ch of sup) if (i < sub.length && ch === sub[i]) i++;
  return i === sub.length;
};

test('shortestCommonSuperseq 基本', () => {
  const r = shortestCommonSuperseq('abac', 'cab');
  // 长度 = 4 + 3 - LCS(2) = 5
  assert.equal(r.length, 5);
  assert.ok(isSubseq(r.superseq, 'abac'));
  assert.ok(isSubseq(r.superseq, 'cab'));
});

test('shortestCommonSuperseq 长度公式', () => {
  // |a|+|b|-|LCS|
  assert.equal(shortestCommonSuperseq('abc', 'abc').length, 3);
  assert.equal(shortestCommonSuperseq('abc', 'def').length, 6);
  assert.equal(shortestCommonSuperseq('', 'abc').superseq, 'abc');
  assert.equal(shortestCommonSuperseq('abc', '').superseq, 'abc');
});

test('shortestCommonSuperseq 是超序列', () => {
  const cases: Array<[string, string]> = [
    ['abac', 'cab'],
    ['geek', 'eke'],
    ['AGGTAB', 'GXTXAYB'],
  ];
  for (const [a, b] of cases) {
    const r = shortestCommonSuperseq(a, b);
    assert.ok(isSubseq(r.superseq, a), a);
    assert.ok(isSubseq(r.superseq, b), b);
  }
});

test('shortestCommonSuperseq 钩子', () => {
  let cells = 0;
  shortestCommonSuperseq('ab', 'bc', { onCell: () => cells++ });
  assert.ok(cells > 0);
});
