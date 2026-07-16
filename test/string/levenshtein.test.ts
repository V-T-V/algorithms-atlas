import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  levenshtein,
  levenshteinRolling,
  backtrack,
} from '../../src/algorithms/string/levenshtein/impl.ts';

test('levenshtein 经典 kitten → sitting = 3', () => {
  assert.equal(levenshtein('kitten', 'sitting'), 3);
});

test('levenshtein 已知值', () => {
  assert.equal(levenshtein('', ''), 0);
  assert.equal(levenshtein('abc', ''), 3); // 全删
  assert.equal(levenshtein('', 'abc'), 3); // 全插
  assert.equal(levenshtein('abc', 'abc'), 0); // 相同
  assert.equal(levenshtein('flaw', 'lawn'), 2);
  assert.equal(levenshtein('sunday', 'saturday'), 3);
});

test('levenshtein 对称性', () => {
  const pairs: Array<[string, string]> = [
    ['abc', 'abd'],
    ['kitten', 'sitting'],
    ['flaw', 'lawn'],
    ['intention', 'execution'],
  ];
  for (const [a, b] of pairs) {
    assert.equal(levenshtein(a, b), levenshtein(b, a), `${a}↔${b} 应对称`);
  }
});

test('levenshtein 与滚动数组版一致', () => {
  for (const [a, b] of [
    ['kitten', 'sitting'],
    ['abc', 'xyz'],
    ['flaw', 'lawn'],
    ['', 'abc'],
    ['abc', ''],
  ] as const) {
    assert.equal(levenshtein(a, b), levenshteinRolling(a, b));
  }
});

test('levenshtein 满足三角不等式', () => {
  // d(a,c) <= d(a,b) + d(b,c)
  const a = 'kitten';
  const b = 'sitting';
  const c = 'knitting';
  assert.ok(levenshtein(a, c) <= levenshtein(a, b) + levenshtein(b, c), '应满足三角不等式');
});

test('backtrace 回溯一条最优路径', () => {
  // 直接构造 dp 表并回溯
  const a = 'kitten';
  const b = 'sitting';
  const dist = levenshtein(a, b);
  // 重建 dp（与 impl 一致）
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i]![0] = i;
  for (let j = 0; j <= m; j++) dp[0]![j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(dp[i - 1]![j - 1]! + cost, dp[i]![j - 1]! + 1, dp[i - 1]![j]! + 1);
    }
  }
  const path = backtrack(a, b, dp);
  // 路径上的 edit（非 match）操作数应等于距离
  const edits = path.filter((s) => s.op !== 'match').length;
  assert.equal(edits, dist, `回溯的编辑操作数应等于距离 ${dist}`);
  // 路径覆盖了所有 a 和 b 的字符
  assert.equal(path.filter((s) => s.op !== 'insert').length, n);
  assert.equal(path.filter((s) => s.op !== 'delete').length, m);
});

test('levenshtein 钩子被调用', () => {
  let cells = 0;
  let sets = 0;
  let done = 0;
  levenshtein('cat', 'cut', {
    onCell: () => cells++,
    onSet: () => sets++,
    onDone: () => done++,
  });
  assert.ok(cells >= 1);
  assert.ok(sets >= 6, '至少填 (n+1)*(m+1) 个单元格');
  assert.equal(done, 1);
});
