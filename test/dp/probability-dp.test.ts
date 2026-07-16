import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  probabilityDp,
  binomial,
  type CoinTossInput,
} from '../../src/algorithms/dp/probability-dp/impl.ts';

const approxEq = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

/** 闭式二项分布概率：C(n,k)·p^k·(1-p)^(n-k)。 */
function binomProb(n: number, k: number, p: number): number {
  return binomial(n, k) * p ** k * (1 - p) ** (n - k);
}

test('probability-dp 与二项分布闭式一致', () => {
  for (const inp of [
    { n: 6, p: 0.5, k: 3 },
    { n: 10, p: 0.3, k: 4 },
    { n: 5, p: 0.8, k: 0 },
    { n: 5, p: 0.8, k: 5 },
    { n: 1, p: 0.5, k: 1 },
  ] as CoinTossInput[]) {
    const { prob } = probabilityDp(inp);
    assert.ok(
      approxEq(prob, binomProb(inp.n, inp.k, inp.p)),
      `n=${inp.n},p=${inp.p},k=${inp.k}: dp=${prob}, binom=${binomProb(inp.n, inp.k, inp.p)}`,
    );
  }
});

test('probability-dp 演示默认值 6 枚硬币恰好 3 正面', () => {
  const { prob } = probabilityDp({ n: 6, p: 0.5, k: 3 });
  // C(6,3)/64 = 20/64 = 0.3125
  assert.ok(approxEq(prob, 0.3125));
});

test('probability-dp p=1 时全为正面', () => {
  const { prob, dp } = probabilityDp({ n: 4, p: 1, k: 4 });
  assert.ok(approxEq(prob, 1));
  assert.ok(approxEq(dp[4]![4]!, 1));
  assert.ok(approxEq(dp[4]![0]!, 0));
});

test('probability-dp p=0 时全为反面', () => {
  const { prob } = probabilityDp({ n: 4, p: 0, k: 0 });
  assert.ok(approxEq(prob, 1));
});

test('probability-dp 概率归一：某行所有 j 概率之和为 1', () => {
  const { dp } = probabilityDp({ n: 5, p: 0.4, k: 2 });
  let sum = 0;
  for (let j = 0; j <= 5; j++) sum += dp[5]![j]!;
  assert.ok(approxEq(sum, 1), `概率之和应为 1，实际 ${sum}`);
});

test('probability-dp 单枚硬币', () => {
  const { prob } = probabilityDp({ n: 1, p: 0.7, k: 1 });
  assert.ok(approxEq(prob, 0.7));
});

test('probability-dp 边界 k=0', () => {
  const { prob } = probabilityDp({ n: 3, p: 0.5, k: 0 });
  // (1/2)^3 = 0.125
  assert.ok(approxEq(prob, 0.125));
});

test('probability-dp 钩子被调用', () => {
  let cells = 0;
  let doneProb = -1;
  probabilityDp(
    { n: 4, p: 0.5, k: 2 },
    {
      onFillCell: () => cells++,
      onDone: (p) => {
        doneProb = p;
      },
    },
  );
  // dp 表共填 (n+1)(n+2)/2 + 1 个有效格（含 dp[0][0]）
  assert.ok(cells >= (4 * 5) / 2 + 1);
  assert.ok(doneProb >= 0);
});
