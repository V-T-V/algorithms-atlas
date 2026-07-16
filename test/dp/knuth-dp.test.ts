import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knuthDp } from '../../src/algorithms/dp/knuth-dp/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/knuth-dp/trace.ts';

/** 暴力 O(n^3) 区间 DP 作对照。 */
function brute(a: number[]): number {
  const n = a.length;
  if (n <= 1) return 0;
  const pref = [0];
  for (let i = 0; i < n; i++) pref.push(pref[i]! + a[i]!);
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const s = pref[j + 1]! - pref[i]!;
      let best = Infinity;
      for (let k = i; k < j; k++) best = Math.min(best, dp[i]![k]! + dp[k + 1]![j]! + s);
      dp[i]![j] = best;
    }
  }
  return dp[0]![n - 1]!;
}

test('knuth-dp 与暴力一致', () => {
  const cases = [
    [4, 2, 3, 1, 5, 6],
    [1, 2, 3, 4],
    [5, 2, 8, 1, 9, 3, 7, 4, 6],
    [1, 1, 1, 1],
  ];
  for (const a of cases) assert.equal(knuthDp(a), brute(a));
});

test('knuth-dp 已知答案', () => {
  assert.equal(knuthDp([1, 2, 3, 4]), 19); // (1+2)+(3+3)+(6+4)=3+6+10=19
});

test('knuth-dp 边界', () => {
  assert.equal(knuthDp([]), 0);
  assert.equal(knuthDp([10]), 0);
});

test('knuth-dp 钩子被调用', () => {
  let tries = 0;
  let fills = 0;
  knuthDp([4, 2, 3, 1, 5, 6], {
    onTry: () => tries++,
    onFill: () => fills++,
  });
  assert.ok(tries > 0);
  assert.ok(fills > 0);
});

test('knuth-dp buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
