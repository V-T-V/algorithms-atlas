import { test } from 'node:test';
import assert from 'node:assert/strict';
import { damerau } from '../../src/algorithms/string/damerau/impl.ts';

const dist = (a: string, b: string): number => {
  const dp = damerau(a, b);
  return dp[a.length]![b.length]!;
};

test('damerau 基本距离', () => {
  assert.equal(dist('', ''), 0);
  assert.equal(dist('CA', 'ABC'), 3); // OSA: 依次插入/替换
  assert.equal(dist('abc', 'abc'), 0);
  assert.equal(dist('kitten', 'sitting'), 3);
});

test('damerau 相邻交换算 1 次（区别于莱文斯坦）', () => {
  // levenshtein("ab","ba")=2, damerau=1
  assert.equal(dist('ab', 'ba'), 1);
  assert.equal(dist('abcd', 'acbd'), 1);
});

test('damerau 钩子被调用', () => {
  let cells = 0;
  let swaps = 0;
  let done = -1;
  damerau('ab', 'ba', {
    onCell: () => cells++,
    onSource: (_i, _j, op) => {
      if (op === 'swap') swaps++;
    },
    onDone: (d) => (done = d),
  });
  assert.equal(cells, 2 * 2, '应填 2×2 个内部格');
  assert.ok(swaps >= 1, '应至少触发一次 swap 来源');
  assert.equal(done, 1);
});
