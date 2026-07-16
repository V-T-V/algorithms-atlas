import { test } from 'node:test';
import assert from 'node:assert/strict';
import { divideConquerDp } from '../../src/algorithms/dp/divide-conquer-dp/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/divide-conquer-dp/trace.ts';

/** 暴力 O(n^2) DP 作对照。 */
function bruteDp(n: number, cost: (l: number, r: number) => number): number[] {
  const dp = new Array<number>(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) dp[i] = Math.min(dp[i]!, dp[j]! + cost(j, i - 1));
  }
  return dp;
}

test('divide-conquer-dp 与暴力一致（可加 Monge 代价）', () => {
  const values = [3, 1, 4, 1, 5, 9];
  const n = values.length;
  const pref = [0];
  for (let i = 0; i < n; i++) pref.push(pref[i]! + values[i]!);
  const cost = (l: number, r: number) => pref[r + 1]! - pref[l]! + (r - l + 1);
  const res = divideConquerDp(n, cost);
  const brute = bruteDp(n, cost);
  assert.deepEqual(res.dp, brute);
});

test('divide-conquer-dp 决策点单调', () => {
  const values = [2, 5, 3, 8, 1, 7, 4];
  const n = values.length;
  const pref = [0];
  for (let i = 0; i < n; i++) pref.push(pref[i]! + values[i]!);
  const cost = (l: number, r: number) => pref[r + 1]! - pref[l]!;
  const res = divideConquerDp(n, cost);
  for (let i = 2; i <= n; i++) {
    assert.ok(res.opt[i]! >= res.opt[i - 1]!, `opt[${i}] 应 >= opt[${i - 1}]`);
  }
});

test('divide-conquer-dp 边界', () => {
  assert.deepEqual(divideConquerDp(0, () => 0).dp, [0]);
  assert.deepEqual(divideConquerDp(1, () => 5).dp, [0, 5]);
});

test('divide-conquer-dp 钩子被调用', () => {
  let solves = 0;
  let fills = 0;
  divideConquerDp(5, () => 1, {
    onSolve: () => solves++,
    onFill: () => fills++,
  });
  assert.ok(solves > 0);
  assert.equal(fills, 5);
});

test('divide-conquer-dp buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
