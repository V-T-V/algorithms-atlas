import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcs, lcsLength } from '../../src/algorithms/dp/lcs/impl.ts';

// 辅助：判定 s 是否是 t 的子序列（顺序一致即可，不要求连续）。
function isSubsequence(s: string, t: string): boolean {
  let i = 0;
  for (const ch of t) if (i < s.length && ch === s[i]) i++;
  return i === s.length;
}

test('lcs 基本行为', () => {
  assert.equal(lcs('', ''), '');
  assert.equal(lcs('A', ''), '');
  assert.equal(lcs('', 'B'), '');
  assert.equal(lcs('A', 'A'), 'A');
});

test('lcs 经典用例', () => {
  // ABCBDAB / BDCAB → 长度 4，可能为 BCAB / BDAB
  const r = lcs('ABCBDAB', 'BDCAB');
  assert.equal(r.length, 4);
  assert.ok(isSubsequence(r, 'ABCBDAB'), `${r} 应是 A 的子序列`);
  assert.ok(isSubsequence(r, 'BDCAB'), `${r} 应是 B 的子序列`);

  assert.equal(lcs('AGGTAB', 'GXTXAYB'), 'GTAB'); // 经典长度 4
});

test('lcs 长度辅助与主函数一致', () => {
  assert.equal(lcsLength('ABCBDAB', 'BDCAB'), 4);
  assert.equal(lcsLength('AGGTAB', 'GXTXAYB'), 4);
  assert.equal(lcsLength('AAAA', 'AA'), 2);
  assert.equal(lcsLength('ABC', 'DEF'), 0);
});

test('lcs 钩子被调用', () => {
  let fill = 0;
  let match = 0;
  lcs('ABCBDAB', 'BDCAB', {
    onFillCell: (i, j, val, from) => {
      fill++;
      if (from === 'match') match++;
    },
    onBacktrack: () => {},
  });
  // 内部格数 = m*n（i∈1..m, j∈1..n）：7*5 = 35
  assert.equal(fill, 7 * 5, '应填满内部 m*n 格');
  assert.ok(match > 0, '至少出现一次字符匹配');
});
