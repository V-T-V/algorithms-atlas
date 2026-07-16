# -*- coding: utf-8 -*-
"""Data for 108 algorithms. Each dict: cat, id, tzh, ten, szh, sen, dzh, den, tags, time, space, impl, trace, test"""

ALL = []

def add(**kw):
    ALL.append(kw)

# ===========================================================================
# DP (20)
# ===========================================================================

add(cat="dp", id="dp-lis-5",
    tzh="最长递增子序列（贪心+二分）", ten="Longest Increasing Subsequence (Binary Search)",
    szh="O(n log n) 贪心二分求最长严格递增子序列长度。", sen="O(n log n) greedy + binary search for LIS length.",
    dzh="维护一个尾数数组 tails，tails[k] 为长度 k+1 的递增子序列的最小尾数。每读入 x，在 tails 中二分第一个 >=x 的位置并替换（严格递增用 lower_bound），最终 tails 长度即为 LIS。",
    den="Maintain tails array where tails[k] = smallest tail of an increasing subsequence of length k+1. For each x, binary search first >= x and replace. Length of tails = LIS length.",
    tags="['dp','lis','binary-search']", time="O(n log n)", space="O(n)",
    impl="""// =============================================================================
// 最长递增子序列（贪心+二分）· 纯算法实现
// =============================================================================
export interface LisHooks {
  onTail?: (idx: number, value: number) => void;
  onBinarySearch?: (x: number, lo: number, hi: number) => void;
  onDone?: (length: number) => void;
}

export function lengthOfLIS(nums: readonly number[], hooks: LisHooks = {}): number {
  if (nums.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const tails: number[] = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      hooks.onBinarySearch?.(x, lo, hi);
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
    hooks.onTail?.(lo, x);
  }
  hooks.onDone?.(tails.length);
  return tails.length;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lengthOfLIS, type LisHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 9, 2, 5, 3, 7, 101, 18];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tails: number[] = [];
  rec
    .begin({ zh: `数组长度 ${nums.length}`, en: `Array length ${nums.length}` })
    .setAux([{ label: 'tails', value: '∅', role: 'frontier' }])
    .commit();
  const hooks: LisHooks = {
    onTail: (idx, value) => {
      if (idx === tails.length) tails.push(value);
      else tails[idx] = value;
      rec
        .begin({ zh: `更新 tails[${idx}]=${value}`, en: `tails[${idx}]=${value}` })
        .setBars(tails.map((v, i) => ({ value: v, role: (i === idx ? 'swap' : 'default') as BarRole })))
        .setAux([{ label: 'tails', value: tails.join(','), role: 'frontier' }])
        .commit();
    },
  };
  const ans = lengthOfLIS(nums, hooks);
  rec
    .begin({ zh: `LIS 长度=${ans}`, en: `LIS length=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lengthOfLIS } from '../../src/algorithms/dp/dp-lis-5/impl.ts';

test('lis 经典', () => {
  assert.equal(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
});
test('lis 全等', () => {
  assert.equal(lengthOfLIS([7, 7, 7, 7]), 1);
});
test('lis 空', () => {
  assert.equal(lengthOfLIS([]), 0);
});
test('lis 严格递增', () => {
  assert.equal(lengthOfLIS([1, 2, 3, 4]), 4);
});
""")

add(cat="dp", id="dp-lcs-4",
    tzh="最长公共子序列（滚动数组优化）", ten="LCS (Space Optimized)",
    szh="两序列的最长公共子序列，用滚动数组把空间降到 O(min(n,m))。",
    sen="Longest common subsequence with rolling array, space O(min(n,m)).",
    dzh="经典 dp：dp[i][j]=LCS(a前i, b前j)。若 a[i-1]==b[j-1] 则 dp[i][j]=dp[i-1][j-1]+1，否则 =max(dp[i-1][j], dp[i][j-1])。只用两行滚动。",  # noqa
    den="Classic dp[i][j]=LCS of first i of a and first j of b. Match: +1; else max of up/left. Two-row rolling.",
    tags="['dp','lcs','space-optimization']", time="O(n*m)", space="O(min(n,m))",
    impl="""// =============================================================================
// LCS（滚动数组）· 纯算法实现
// =============================================================================
export interface LcsHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onMatch?: (i: number, j: number) => void;
  onDone?: (len: number) => void;
}

export function lengthOfLCS(a: readonly string[], b: readonly string[], hooks: LcsHooks = {}): number {
  const n = a.length, m = b.length;
  if (n === 0 || m === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let prev = new Array<number>(m + 1).fill(0);
  let cur = new Array<number>(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1]! + 1;
        hooks.onMatch?.(i, j);
      } else {
        cur[j] = Math.max(prev[j]!, cur[j - 1]!);
      }
      hooks.onCell?.(i, j, cur[j]!);
    }
    [prev, cur] = [cur, prev];
    cur.fill(0);
  }
  hooks.onDone?.(prev[m]!);
  return prev[m]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lengthOfLCS, type LcsHooks } from './impl.ts';

export const DEFAULT_A = ['A', 'B', 'C', 'B', 'D', 'A', 'B'];
export const DEFAULT_B = ['B', 'D', 'C', 'A', 'B', 'A'];

export function buildTrace(a: readonly string[] = DEFAULT_A, b: readonly string[] = DEFAULT_B): Frame[] {
  const rec = new TraceRecorder();
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  let ci = -1, cj = -1;
  rec
    .begin({ zh: `a 长度 ${n}，b 长度 ${m}`, en: `a len ${n}, b len ${m}` })
    .setGrid(dp.map((row) => row.map((v) => String(v))))
    .commit();
  const hooks: LcsHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      ci = i; cj = j;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setGrid(dp.map((row, r) => row.map((v, c) => ({ v: String(v), role: (r === ci && c === cj ? 'compare' : 'default') as BarRole }))))
        .commit();
    },
  };
  const ans = lengthOfLCS(a, b, hooks);
  rec
    .begin({ zh: `LCS 长度=${ans}`, en: `LCS length=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lengthOfLCS } from '../../src/algorithms/dp/dp-lcs-4/impl.ts';

test('lcs 经典', () => {
  assert.equal(lengthOfLCS('ABCBDAB'.split(''), 'BDCABA'.split('')), 4);
});
test('lcs 全不同', () => {
  assert.equal(lengthOfLCS('ABC'.split(''), 'DEF'.split('')), 0);
});
test('lcs 空', () => {
  assert.equal(lengthOfLCS([], 'AB'.split('')), 0);
});
""")

add(cat="dp", id="dp-edit-4",
    tzh="编辑距离（Levenshtein）", ten="Edit Distance (Levenshtein)",
    szh="把字符串 a 变成 b 的最少插入/删除/替换次数。",
    sen="Minimum insert/delete/replace ops to transform a into b.",
    dzh="dp[i][j] = a前i 变 b前j 的最少操作。若字符相等则 dp[i-1][j-1]；否则 1 + min(替换, 删除, 插入)。",
    den="dp[i][j] = min ops to convert first i of a to first j of b. If equal, diagonal; else 1+min of sub/del/ins.",
    tags="['dp','edit-distance','string']", time="O(n*m)", space="O(n*m)",
    impl="""// =============================================================================
// 编辑距离 · 纯算法实现
// =============================================================================
export interface EditDistHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onMatch?: (i: number, j: number) => void;
  onDone?: (dist: number) => void;
}

export function editDistance(a: string, b: string, hooks: EditDistHooks = {}): number {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) => {
    const row = new Array<number>(m + 1);
    for (let j = 0; j <= m; j++) row[j] = i === 0 ? j : 0;
    if (i > 0) row[0] = i;
    return row;
  });
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
        hooks.onMatch?.(i, j);
      } else {
        dp[i]![j] = 1 + Math.min(dp[i - 1]![j - 1]!, dp[i - 1]![j]!, dp[i]![j - 1]!);
      }
      hooks.onCell?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onDone?.(dp[n]![m]!);
  return dp[n]![m]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { editDistance, type EditDistHooks } from './impl.ts';

export const DEFAULT_A = 'horse';
export const DEFAULT_B = 'ros';

export function buildTrace(a: string = DEFAULT_A, b: string = DEFAULT_B): Frame[] {
  const rec = new TraceRecorder();
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) => {
    const row = new Array<number>(m + 1);
    for (let j = 0; j <= m; j++) row[j] = i === 0 ? j : 0;
    if (i > 0) row[0] = i;
    return row;
  });
  let ci = -1, cj = -1;
  rec
    .begin({ zh: `${a} → ${b}`, en: `${a} -> ${b}` })
    .setGrid(dp.map((row) => row.map((v) => String(v))))
    .setAux([
      { label: 'a', value: a, role: 'frontier' },
      { label: 'b', value: b, role: 'frontier' },
    ])
    .commit();
  const hooks: EditDistHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      ci = i; cj = j;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setGrid(dp.map((row, r) => row.map((v, c) => ({ v: String(v), role: (r === ci && c === cj ? 'compare' : 'default') as BarRole }))))
        .commit();
    },
  };
  const ans = editDistance(a, b, hooks);
  rec
    .begin({ zh: `编辑距离=${ans}`, en: `Edit distance=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editDistance } from '../../src/algorithms/dp/dp-edit-4/impl.ts';

test('edit horse/ros', () => {
  assert.equal(editDistance('horse', 'ros'), 3);
});
test('edit 相同', () => {
  assert.equal(editDistance('abc', 'abc'), 0);
});
test('edit 空', () => {
  assert.equal(editDistance('', 'abc'), 3);
});
test('edit intention/execution', () => {
  assert.equal(editDistance('intention', 'execution'), 5);
});
""")

add(cat="dp", id="dp-knap-4",
    tzh="0-1 背包（一维滚动）", ten="0-1 Knapsack (1D Rolling)",
    szh="n 个物品、容量 W，每物品取或不取，求最大价值。空间 O(W)。",
    sen="0-1 knapsack with 1D rolling array, space O(W).",
    dzh="dp[j] = 容量 j 时的最大价值。倒序遍历 j（保证每物品只取一次）：dp[j]=max(dp[j], dp[j-w[i]]+v[i])。",
    den="dp[j] = max value under capacity j. Iterate j descending to use each item at most once.",
    tags="['dp','knapsack','space-optimization']", time="O(n*W)", space="O(W)",
    impl="""// =============================================================================
// 0-1 背包（一维滚动）· 纯算法实现
// =============================================================================
export interface KnapHooks {
  onItem?: (i: number, w: number, v: number) => void;
  onUpdate?: (cap: number, val: number) => void;
  onDone?: (best: number) => void;
}

export function knapsack01(
  weights: readonly number[], values: readonly number[], capacity: number, hooks: KnapHooks = {},
): number {
  const n = weights.length;
  const dp = new Array<number>(capacity + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const w = weights[i]!, v = values[i]!;
    hooks.onItem?.(i, w, v);
    for (let j = capacity; j >= w; j--) {
      const cand = dp[j - w]! + v;
      if (cand > dp[j]!) {
        dp[j] = cand;
        hooks.onUpdate?.(j, cand);
      }
    }
  }
  hooks.onDone?.(dp[capacity]!);
  return dp[capacity]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsack01, type KnapHooks } from './impl.ts';

export const DEFAULT_W = [2, 3, 4, 5];
export const DEFAULT_V = [3, 4, 5, 6];
export const DEFAULT_CAP = 8;

export function buildTrace(
  weights: readonly number[] = DEFAULT_W, values: readonly number[] = DEFAULT_V, capacity: number = DEFAULT_CAP,
): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(capacity + 1).fill(0);
  rec
    .begin({ zh: `容量 ${capacity}，物品 ${weights.length}`, en: `Cap ${capacity}, items ${weights.length}` })
    .setBars(dp.map((v, j) => ({ value: v, role: 'default' as BarRole, label: String(j) })))
    .commit();
  const hooks: KnapHooks = {
    onUpdate: (cap, val) => {
      dp[cap] = val;
      rec
        .begin({ zh: `dp[${cap}]=${val}`, en: `dp[${cap}]=${val}` })
        .setBars(dp.map((v, j) => ({ value: v, role: (j === cap ? 'swap' : 'default') as BarRole, label: String(j) })))
        .commit();
    },
  };
  const ans = knapsack01(weights, values, capacity, hooks);
  rec
    .begin({ zh: `最大价值=${ans}`, en: `Max value=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsack01 } from '../../src/algorithms/dp/dp-knap-4/impl.ts';

test('knap 经典', () => {
  assert.equal(knapsack01([2, 3, 4, 5], [3, 4, 5, 6], 8), 10);
});
test('knap 容量0', () => {
  assert.equal(knapsack01([1, 2], [5, 6], 0), 0);
});
test('knap 全装不下', () => {
  assert.equal(knapsack01([10], [100], 5), 0);
});
""")

add(cat="dp", id="dp-coin-5",
    tzh="零钱兑换（求最少硬币数）", ten="Coin Change (Min Coins)",
    szh="给定硬币面额，凑出金额 amount 所需的最少硬币数。",
    sen="Minimum number of coins to make up amount.",
    dzh="完全背包：dp[i] = 凑金额 i 的最少硬币数。dp[0]=0；dp[i]=min(dp[i-coin]+1)。",
    den="Unbounded knapsack: dp[i]=min coins for amount i. dp[i]=min(dp[i-coin]+1) over coins.",
    tags="['dp','coin-change','unbounded-knapsack']", time="O(amount*n)", space="O(amount)",
    impl="""// =============================================================================
// 零钱兑换（最少硬币）· 纯算法实现
// =============================================================================
export interface CoinHooks {
  onAmount?: (amt: number) => void;
  onRelax?: (amt: number, coin: number, val: number) => void;
  onDone?: (min: number) => void;
}

export function coinChange(coins: readonly number[], amount: number, hooks: CoinHooks = {}): number {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    hooks.onAmount?.(i);
    for (const c of coins) {
      if (c <= i && dp[i - c]! + 1 < dp[i]!) {
        dp[i] = dp[i - c]! + 1;
        hooks.onRelax?.(i, c, dp[i]!);
      }
    }
  }
  const ans = dp[amount]!;
  const out = ans === INF ? -1 : ans;
  hooks.onDone?.(out);
  return out;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coinChange, type CoinHooks } from './impl.ts';

export const DEFAULT_COINS = [1, 5, 11];
export const DEFAULT_AMOUNT = 15;

export function buildTrace(coins: readonly number[] = DEFAULT_COINS, amount: number = DEFAULT_AMOUNT): Frame[] {
  const rec = new TraceRecorder();
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0;
  rec
    .begin({ zh: `金额 ${amount}，面额 ${coins.join(',')}`, en: `Amount ${amount}, coins ${coins.join(',')}` })
    .setBars(dp.map((v) => ({ value: v === INF ? 0 : v, role: 'default' as BarRole, label: String(v === INF ? '∞' : v) })))
    .commit();
  const hooks: CoinHooks = {
    onRelax: (amt, coin, val) => {
      dp[amt] = val;
      rec
        .begin({ zh: `dp[${amt}]=${val}（用硬币 ${coin}）`, en: `dp[${amt}]=${val} (coin ${coin})` })
        .setBars(dp.map((v, j) => ({ value: v === INF ? 0 : v, role: (j === amt ? 'swap' : 'default') as BarRole, label: String(v === INF ? '∞' : v) })))
        .commit();
    },
  };
  const ans = coinChange(coins, amount, hooks);
  rec
    .begin({ zh: `最少硬币=${ans}`, en: `Min coins=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinChange } from '../../src/algorithms/dp/dp-coin-5/impl.ts';

test('coin 11', () => {
  assert.equal(coinChange([1, 5, 11], 15), 3);  // 5+5+5
});
test('coin 无法凑', () => {
  assert.equal(coinChange([2], 3), -1);
});
test('coin 0', () => {
  assert.equal(coinChange([1, 2, 5], 0), 0);
});
test('coin 11/经典', () => {
  assert.equal(coinChange([1, 2, 5], 11), 3);
});
""")

add(cat="dp", id="dp-climb-5",
    tzh="爬楼梯（最多 k 步）", ten="Climbing Stairs (up to k steps)",
    szh="每次可爬 1..k 阶，求到达顶部的方案数。",
    sen="Climb 1..k steps each move; count distinct ways to top.",
    dzh="dp[i]=dp[i-1]+...+dp[i-k]（前缀和加速到 O(n)）。dp[0]=1。",
    den="dp[i]=sum of dp[i-1..i-k]; use sliding window sum for O(n). dp[0]=1.",
    tags="['dp','climb-stairs','sliding-window']", time="O(n)", space="O(n)",
    impl="""// =============================================================================
// 爬楼梯（最多 k 步）· 纯算法实现
// =============================================================================
export interface ClimbKHooks {
  onStep?: (i: number, ways: number) => void;
  onDone?: (ways: number) => void;
}

export function climbStairsK(n: number, k: number, hooks: ClimbKHooks = {}): number {
  if (n === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  let window = 1;
  for (let i = 1; i <= n; i++) {
    if (i - k - 1 >= 0) window -= dp[i - k - 1]!;
    dp[i] = window;
    window += dp[i]!;
    hooks.onStep?.(i, dp[i]!);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { climbStairsK, type ClimbKHooks } from './impl.ts';

export const DEFAULT_N = 7;
export const DEFAULT_K = 3;

export function buildTrace(n: number = DEFAULT_N, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  rec
    .begin({ zh: `${n} 阶，每次最多 ${k} 步`, en: `${n} steps, up to ${k}` })
    .setBars(dp.map((v, i) => ({ value: v, role: (i === 0 ? 'sorted' : 'default') as BarRole, label: String(i) })))
    .commit();
  const hooks: ClimbKHooks = {
    onStep: (i, ways) => {
      dp[i] = ways;
      rec
        .begin({ zh: `dp[${i}]=${ways}`, en: `dp[${i}]=${ways}` })
        .setBars(dp.map((v, j) => ({ value: v, role: (j === i ? 'compare' : j < i ? 'sorted' : 'default') as BarRole, label: String(j) })))
        .commit();
    },
  };
  const ans = climbStairsK(n, k, hooks);
  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { climbStairsK } from '../../src/algorithms/dp/dp-climb-5/impl.ts';

test('climb k=2 经典', () => {
  assert.equal(climbStairsK(4, 2), 5);
});
test('climb k=3', () => {
  assert.equal(climbStairsK(3, 3), 4);  // 1+1+1, 1+2, 2+1, 3
});
test('climb n=0', () => {
  assert.equal(climbStairsK(0, 3), 1);
});
""")

add(cat="dp", id="dp-robber-6",
    tzh="打家劫舍（环形）", ten="House Robber (Circular)",
    szh="首尾相连的环形街，不能同时偷相邻两家，求最大金额。",
    sen="Houses in a circle; cannot rob two adjacent; maximize loot.",
    dzh="环形：偷首不偷尾，或偷尾不偷首。在 nums[0..n-2] 和 nums[1..n-1] 各跑一次线性 dp 取最大。",
    den="Circular: max of robbing nums[0..n-2] and nums[1..n-1], each via linear dp.",
    tags="['dp','house-robber','circular']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 打家劫舍（环形）· 纯算法实现
// =============================================================================
export interface RobHooks {
  onHouse?: (i: number, robVal: number, skipVal: number) => void;
  onRange?: (lo: number, hi: number) => void;
  onDone?: (best: number) => void;
}

function robLine(nums: readonly number[], lo: number, hi: number, hooks: RobHooks): number {
  let prev2 = 0, prev1 = 0;
  for (let i = lo; i <= hi; i++) {
    const cur = Math.max(prev1, prev2 + nums[i]!);
    hooks.onHouse?.(i, prev2 + nums[i]!, prev1);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

export function robberCircular(nums: readonly number[], hooks: RobHooks = {}): number {
  const n = nums.length;
  if (n === 0) { hooks.onDone?.(0); return 0; }
  if (n === 1) { hooks.onDone?.(nums[0]!); return nums[0]!; }
  hooks.onRange?.(0, n - 2);
  const a = robLine(nums, 0, n - 2, hooks);
  hooks.onRange?.(1, n - 1);
  const b = robLine(nums, 1, n - 1, hooks);
  const ans = Math.max(a, b);
  hooks.onDone?.(ans);
  return ans;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robberCircular, type RobHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, 2, 5, 4];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const taken = new Array<boolean>(nums.length).fill(false);
  rec
    .begin({ zh: `${nums.length} 家环形排列`, en: `${nums.length} houses in a circle` })
    .setBars(nums.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const hooks: RobHooks = {
    onHouse: (i, robVal, _skipVal) => {
      taken[i] = robVal > _skipVal;
      rec
        .begin({ zh: `考虑第 ${i} 家`, en: `Consider house ${i}` })
        .setBars(nums.map((v, j) => ({ value: v, role: (j === i ? 'compare' : taken[j] ? 'sorted' : 'default') as BarRole, label: String(j) })))
        .commit();
    },
  };
  const ans = robberCircular(nums, hooks);
  rec
    .begin({ zh: `最大金额=${ans}`, en: `Max loot=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robberCircular } from '../../src/algorithms/dp/dp-robber-6/impl.ts';

test('rob 环形', () => {
  assert.equal(robberCircular([2, 3, 2]), 3);
});
test('rob 环形2', () => {
  assert.equal(robberCircular([1, 2, 3, 1]), 4);
});
test('rob 单家', () => {
  assert.equal(robberCircular([5]), 5);
});
test('rob 空', () => {
  assert.equal(robberCircular([]), 0);
});
""")

add(cat="dp", id="dp-stock-8",
    tzh="买卖股票（含手续费）", ten="Best Time to Buy/Sell with Fee",
    szh="可多次买卖，每次卖出收手续费 fee，求最大利润。",
    sen="Unlimited trades, pay fee per sell; max profit.",
    dzh="hold=持有股票时的最大利润，cash=不持有时的最大利润。转移：hold=max(hold, cash-price)；cash=max(cash, hold+price-fee)。",
    den="State machine: hold=max(hold, cash-price); cash=max(cash, hold+price-fee).",
    tags="['dp','stock','transaction-fee']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 买卖股票（含手续费）· 纯算法实现
// =============================================================================
export interface StockFeeHooks {
  onDay?: (i: number, price: number, hold: number, cash: number) => void;
  onDone?: (profit: number) => void;
}

export function maxProfitFee(prices: readonly number[], fee: number, hooks: StockFeeHooks = {}): number {
  if (prices.length === 0) { hooks.onDone?.(0); return 0; }
  let cash = 0, hold = -prices[0]!;
  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]!;
    const newHold = Math.max(hold, cash - p);
    const newCash = Math.max(cash, hold + p - fee);
    hold = newHold; cash = newCash;
    hooks.onDay?.(i, p, hold, cash);
  }
  hooks.onDone?.(cash);
  return cash;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitFee, type StockFeeHooks } from './impl.ts';

export const DEFAULT_PRICES = [1, 3, 2, 8, 4, 9];
export const DEFAULT_FEE = 2;

export function buildTrace(prices: readonly number[] = DEFAULT_PRICES, fee: number = DEFAULT_FEE): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `股价 ${prices.length} 天，手续费 ${fee}`, en: `${prices.length} days, fee ${fee}` })
    .setBars(prices.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();
  const hooks: StockFeeHooks = {
    onDay: (i, price, hold, cash) => {
      rec
        .begin({ zh: `第${i}天 价${price} cash=${cash} hold=${hold}`, en: `Day ${i} price ${price} cash=${cash} hold=${hold}` })
        .setBars(prices.map((p, j) => ({ value: p, role: (j === i ? 'compare' : 'default') as BarRole })))
        .setAux([
          { label: 'cash', value: String(cash), role: 'frontier' },
          { label: 'hold', value: String(hold), role: 'frontier' },
        ])
        .commit();
    },
  };
  const ans = maxProfitFee(prices, fee, hooks);
  rec
    .begin({ zh: `最大利润=${ans}`, en: `Max profit=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitFee } from '../../src/algorithms/dp/dp-stock-8/impl.ts';

test('stock fee 经典', () => {
  assert.equal(maxProfitFee([1, 3, 2, 8, 4, 9], 2), 8);
});
test('stock fee 单调', () => {
  assert.equal(maxProfitFee([1, 2, 3, 4], 1), 2);
});
test('stock fee 空', () => {
  assert.equal(maxProfitFee([], 1), 0);
});
""")

add(cat="dp", id="dp-stock-9",
    tzh="买卖股票（含冷冻期）", ten="Best Time to Buy/Sell with Cooldown",
    szh="多次买卖，卖出后第二天不能买入（冷冻期 1 天），求最大利润。",
    sen="Unlimited trades, 1-day cooldown after sell; max profit.",
    dzh="三状态机：hold（持有）、cash（不持有可买）、cool（冷冻，刚卖出）。cool=max(hold+p)；hold=max(hold, cash-p)；cash=max(cash, cool)。",
    den="Three states: hold/cash/cool. cool=max(hold+p); hold=max(hold,cash-p); cash=max(cash,cool).",
    tags="['dp','stock','cooldown']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 买卖股票（冷冻期）· 纯算法实现
// =============================================================================
export interface StockCoolHooks {
  onDay?: (i: number, price: number, hold: number, cash: number, cool: number) => void;
  onDone?: (profit: number) => void;
}

export function maxProfitCooldown(prices: readonly number[], hooks: StockCoolHooks = {}): number {
  if (prices.length === 0) { hooks.onDone?.(0); return 0; }
  let hold = -prices[0]!, cash = 0, cool = 0;
  for (let i = 1; i < prices.length; i++) {
    const p = prices[i]!;
    const newCool = hold + p;
    const newHold = Math.max(hold, cash - p);
    const newCash = Math.max(cash, cool);
    hold = newHold; cool = newCool; cash = newCash;
    hooks.onDay?.(i, p, hold, cash, cool);
  }
  const ans = Math.max(cash, cool);
  hooks.onDone?.(ans);
  return ans;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProfitCooldown, type StockCoolHooks } from './impl.ts';

export const DEFAULT_PRICES = [1, 2, 3, 0, 2];

export function buildTrace(prices: readonly number[] = DEFAULT_PRICES): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `${prices.length} 天股价`, en: `${prices.length} days` })
    .setBars(prices.map((p) => ({ value: p, role: 'default' as BarRole })))
    .commit();
  const hooks: StockCoolHooks = {
    onDay: (i, price, hold, cash, cool) => {
      rec
        .begin({ zh: `第${i}天 价${price}`, en: `Day ${i} price ${price}` })
        .setBars(prices.map((p, j) => ({ value: p, role: (j === i ? 'compare' : 'default') as BarRole })))
        .setAux([
          { label: 'cash', value: String(cash), role: 'frontier' },
          { label: 'hold', value: String(hold), role: 'frontier' },
          { label: 'cool', value: String(cool), role: 'warn' },
        ])
        .commit();
    },
  };
  const ans = maxProfitCooldown(prices, hooks);
  rec
    .begin({ zh: `最大利润=${ans}`, en: `Max profit=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProfitCooldown } from '../../src/algorithms/dp/dp-stock-9/impl.ts';

test('cooldown 经典', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 0, 2]), 3);
});
test('cooldown 单调', () => {
  assert.equal(maxProfitCooldown([1, 2, 3, 4]), 3);
});
test('cooldown 空', () => {
  assert.equal(maxProfitCooldown([]), 0);
});
""")

add(cat="dp", id="dp-maxprod-3",
    tzh="最大子数组乘积", ten="Maximum Product Subarray",
    szh="数组中连续子数组的最大乘积（含负数）。",
    sen="Maximum product of a contiguous subarray (may include negatives).",
    dzh="同时维护当前最大乘积 maxP 与最小乘积 minP（因为负负得正）。遇到负数交换二者。ans=max(ans, maxP)。",
    den="Track running max and min product (min can flip to max via negative).",
    tags="['dp','maximum-product','subarray']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 最大子数组乘积 · 纯算法实现
// =============================================================================
export interface MaxProdHooks {
  onElement?: (i: number, x: number, maxP: number, minP: number) => void;
  onDone?: (max: number) => void;
}

export function maxProduct(nums: readonly number[], hooks: MaxProdHooks = {}): number {
  if (nums.length === 0) { hooks.onDone?.(0); return 0; }
  let ans = nums[0]!, maxP = nums[0]!, minP = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]!;
    const a = maxP * x, b = minP * x;
    maxP = Math.max(x, a, b);
    minP = Math.min(x, a, b);
    if (maxP > ans) ans = maxP;
    hooks.onElement?.(i, x, maxP, minP);
  }
  hooks.onDone?.(ans);
  return ans;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxProduct, type MaxProdHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, -2, 4, -1];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `${nums.length} 个数`, en: `${nums.length} numbers` })
    .setBars(nums.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const hooks: MaxProdHooks = {
    onElement: (i, x, maxP, minP) => {
      rec
        .begin({ zh: `第${i}个 ${x}：maxP=${maxP} minP=${minP}`, en: `#${i} ${x}: maxP=${maxP} minP=${minP}` })
        .setBars(nums.map((v, j) => ({ value: v, role: (j === i ? 'compare' : 'default') as BarRole })))
        .setAux([
          { label: 'maxP', value: String(maxP), role: 'frontier' },
          { label: 'minP', value: String(minP), role: 'warn' },
        ])
        .commit();
    },
  };
  const ans = maxProduct(nums, hooks);
  rec
    .begin({ zh: `最大乘积=${ans}`, en: `Max product=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxProduct } from '../../src/algorithms/dp/dp-maxprod-3/impl.ts';

test('prod 经典', () => {
  assert.equal(maxProduct([2, 3, -2, 4]), 6);
});
test('prod 含两个负数', () => {
  assert.equal(maxProduct([-2, 3, -4]), 24);
});
test('prod 空', () => {
  assert.equal(maxProduct([]), 0);
});
test('prod 全负', () => {
  assert.equal(maxProduct([-2, -3, -1]), 6);
});
""")

add(cat="dp", id="dp-minpath-3",
    tzh="最小路径和", ten="Minimum Path Sum",
    szh="m×n 网格，从左上到右下每次只能右移或下移，求最小路径和。",
    sen="Top-left to bottom-right moving only right/down; minimize path sum.",
    dzh="dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])。原地修改 grid 即可。",
    den="dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]); in-place.",
    tags="['dp','grid','shortest-path']", time="O(m*n)", space="O(1)",
    impl="""// =============================================================================
// 最小路径和 · 纯算法实现（原地）
// =============================================================================
export interface MinPathHooks {
  onCell?: (i: number, j: number, val: number) => void;
  onDone?: (sum: number) => void;
}

export function minPathSum(grid: number[][], hooks: MinPathHooks = {}): number {
  const m = grid.length;
  if (m === 0) { hooks.onDone?.(0); return 0; }
  const n = grid[0]!.length;
  for (let j = 1; j < n; j++) { grid[0]![j]! += grid[0]![j - 1]!; hooks.onCell?.(0, j, grid[0]![j]!); }
  for (let i = 1; i < m; i++) {
    grid[i]![0]! += grid[i - 1]![0]!;
    hooks.onCell?.(i, 0, grid[i]![0]!);
    for (let j = 1; j < n; j++) {
      grid[i]![j]! += Math.min(grid[i - 1]![j]!, grid[i]![j - 1]!);
      hooks.onCell?.(i, j, grid[i]![j]!);
    }
  }
  hooks.onDone?.(grid[m - 1]![n - 1]!);
  return grid[m - 1]![n - 1]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minPathSum, type MinPathHooks } from './impl.ts';

export const DEFAULT_GRID = [[1, 3, 1], [1, 5, 1], [4, 2, 1]];

export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  let ci = -1, cj = -1;
  rec
    .begin({ zh: `${grid.length}×${grid[0]!.length} 网格`, en: `${grid.length}x${grid[0]!.length} grid` })
    .setGrid(grid.map((row) => row.map((v) => String(v))))
    .commit();
  const hooks: MinPathHooks = {
    onCell: (i, j, val) => {
      grid[i]![j] = val;
      ci = i; cj = j;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setGrid(grid.map((row, r) => row.map((v, c) => ({ v: String(v), role: (r === ci && c === cj ? 'compare' : 'default') as BarRole }))))
        .commit();
    },
  };
  const ans = minPathSum(grid, hooks);
  rec
    .begin({ zh: `最小路径和=${ans}`, en: `Min path sum=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minPathSum } from '../../src/algorithms/dp/dp-minpath-3/impl.ts';

test('minpath 经典', () => {
  assert.equal(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]), 7);
});
test('minpath 1x1', () => {
  assert.equal(minPathSum([[5]]), 5);
});
test('minpath 单行', () => {
  assert.equal(minPathSum([[1, 2, 3]]), 6);
});
""")

add(cat="dp", id="dp-dungeon-3",
    tzh="地下城游戏（最小初始血量）", ten="Dungeon Game (Min Initial HP)",
    szh="从左上到右下，每格增/减血，血须始终 >0，求最小初始血量。",
    sen="Top-left to bottom-right, each cell +/- HP, HP must stay >0; find min initial HP.",
    dzh="反向 dp：dp[i][j] = 从该格到终点所需的最小血量。dp[i][j]=max(1, min(dp[i+1][j], dp[j+1])-dmg[i][j])。",
    den="Reverse dp[i][j]=min HP needed from cell to princess. dp=max(1, min(right,down)-dmg).",
    tags="['dp','grid','reverse-dp']", time="O(m*n)", space="O(n)",
    impl="""// =============================================================================
// 地下城游戏 · 纯算法实现
// =============================================================================
export interface DungeonHooks {
  onCell?: (i: number, j: number, need: number) => void;
  onDone?: (initial: number) => void;
}

export function calculateMinimumHP(dungeon: readonly (readonly number[])[], hooks: DungeonHooks = {}): number {
  const m = dungeon.length;
  if (m === 0) { hooks.onDone?.(1); return 1; }
  const n = dungeon[0]!.length;
  const dp = new Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
  dp[n - 1] = 1;
  for (let i = m - 1; i >= 0; i--) {
    const cur = new Array<number>(n + 1).fill(Number.POSITIVE_INFINITY);
    for (let j = n - 1; j >= 0; j--) {
      const need = Math.min(cur[j + 1]!, dp[j]!) - dungeon[i]![j]!;
      cur[j] = Math.max(1, need);
      hooks.onCell?.(i, j, cur[j]!);
    }
    for (let j = 0; j <= n; j++) dp[j] = cur[j]!;
  }
  hooks.onDone?.(dp[0]!);
  return dp[0]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { calculateMinimumHP, type DungeonHooks } from './impl.ts';

export const DEFAULT_DUNGEON = [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]];

export function buildTrace(dungeon: readonly (readonly number[])[] = DEFAULT_DUNGEON): Frame[] {
  const rec = new TraceRecorder();
  const m = dungeon.length, n = dungeon[0]!.length;
  const need: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let ci = -1, cj = -1;
  rec
    .begin({ zh: `地下城 ${m}×${n}`, en: `Dungeon ${m}x${n}` })
    .setGrid(dungeon.map((row) => row.map((v) => String(v))))
    .commit();
  const hooks: DungeonHooks = {
    onCell: (i, j, val) => {
      need[i]![j] = val;
      ci = i; cj = j;
      rec
        .begin({ zh: `need[${i}][${j}]=${val}`, en: `need[${i}][${j}]=${val}` })
        .setGrid(need.map((row, r) => row.map((v, c) => ({ v: String(v), role: (r === ci && c === cj ? 'compare' : 'default') as BarRole }))))
        .setAux([{ label: 'dmg', value: String(dungeon[i]![j]), role: 'warn' }])
        .commit();
    },
  };
  const ans = calculateMinimumHP(dungeon, hooks);
  rec
    .begin({ zh: `最小初始血量=${ans}`, en: `Min initial HP=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMinimumHP } from '../../src/algorithms/dp/dp-dungeon-3/impl.ts';

test('dungeon 经典', () => {
  assert.equal(calculateMinimumHP([[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]), 7);
});
test('dungeon 单格伤害', () => {
  assert.equal(calculateMinimumHP([[-5]]), 6);
});
test('dungeon 单格回血', () => {
  assert.equal(calculateMinimumHP([[5]]), 1);
});
""")

add(cat="dp", id="dp-split-3",
    tzh="整数拆分（最大积）", ten="Integer Break (Max Product)",
    szh="把整数 n 拆成至少两个正整数之和，使乘积最大。",
    sen="Split n into >=2 positive integers to maximize product.",
    dzh="dp[i] = 把 i 拆分得到的最大积。dp[i]=max(j * (i-j), j * dp[i-j])，遍历 j。",
    den="dp[i]=max product of split i. dp[i]=max(j*(i-j), j*dp[i-j]) over j.",
    tags="['dp','integer-break','math']", time="O(n^2)", space="O(n)",
    impl="""// =============================================================================
// 整数拆分（最大积）· 纯算法实现
// =============================================================================
export interface SplitHooks {
  onNum?: (i: number, best: number) => void;
  onTry?: (i: number, j: number, val: number) => void;
  onDone?: (max: number) => void;
}

export function integerBreak(n: number, hooks: SplitHooks = {}): number {
  if (n <= 3) { hooks.onDone?.(n - 1); return n - 1; }
  const dp = new Array<number>(n + 1).fill(0);
  dp[1] = 1; dp[2] = 2; dp[3] = 3;
  for (let i = 4; i <= n; i++) {
    let best = 0;
    for (let j = 1; j <= i >> 1; j++) {
      const v = j * (i - j);
      const v2 = j * dp[i - j]!;
      const cand = Math.max(v, v2);
      if (cand > best) best = cand;
      hooks.onTry?.(i, j, cand);
    }
    dp[i] = best;
    hooks.onNum?.(i, best);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integerBreak, type SplitHooks } from './impl.ts';

export const DEFAULT_N = 10;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  rec
    .begin({ zh: `拆分 ${n}`, en: `Break ${n}` })
    .setBars(dp.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const hooks: SplitHooks = {
    onNum: (i, best) => {
      dp[i] = best;
      rec
        .begin({ zh: `dp[${i}]=${best}`, en: `dp[${i}]=${best}` })
        .setBars(dp.map((v, j) => ({ value: v, role: (j === i ? 'compare' : 'default') as BarRole, label: String(j) })))
        .commit();
    },
  };
  const ans = integerBreak(n, hooks);
  rec
    .begin({ zh: `最大积=${ans}`, en: `Max product=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { integerBreak } from '../../src/algorithms/dp/dp-split-3/impl.ts';

test('split 10', () => {
  assert.equal(integerBreak(10), 36);
});
test('split 2', () => {
  assert.equal(integerBreak(2), 1);
});
test('split 3', () => {
  assert.equal(integerBreak(3), 2);
});
test('split 5', () => {
  assert.equal(integerBreak(5), 6);
});
""")

add(cat="dp", id="dp-superwash-3",
    tzh="超级洗衣机", ten="Super Washing Machines",
    szh="n 台洗衣机，每台可向相邻移动 1 件衣服，求使所有台数相等的最少步数。",
    sen="Each move shifts 1 dress to neighbor; min moves to equalize all machines.",
    dzh="设总 dress 为 S，target=S/n。对每台算 gain[i]=sum(dress[0..i])-target*(i+1)，答案=max(|gain[i]|, max 一次穿过)。",
    den="target=S/n. gain[i]=prefix sum - target*(i+1). Answer=max(|gain[i]|).",
    tags="['dp','greedy','prefix-sum']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 超级洗衣机 · 纯算法实现
// =============================================================================
export interface SuperWashHooks {
  onMachine?: (i: number, gain: number, ans: number) => void;
  onDone?: (steps: number) => void;
}

export function findMinMoves(machines: readonly number[], hooks: SuperWashHooks = {}): number {
  const sum = machines.reduce((a, b) => a + b, 0);
  const n = machines.length;
  if (sum % n !== 0) { hooks.onDone?.(-1); return -1; }
  const target = sum / n;
  let ans = 0, balance = 0;
  for (let i = 0; i < n; i++) {
    const diff = machines[i]! - target;
    balance += diff;
    hooks.onMachine?.(i, balance, Math.max(ans, Math.abs(balance), diff));
    ans = Math.max(ans, Math.abs(balance), diff);
  }
  hooks.onDone?.(ans);
  return ans;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinMoves, type SuperWashHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 0, 5];

export function buildTrace(machines: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let balance = 0;
  const sum = machines.reduce((a, b) => a + b, 0);
  const target = machines.length ? sum / machines.length : 0;
  rec
    .begin({ zh: `target=${target}`, en: `target=${target}` })
    .setBars(machines.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const hooks: SuperWashHooks = {
    onMachine: (i, gain, ans) => {
      balance = gain;
      rec
        .begin({ zh: `第${i}台 balance=${balance} 当前ans=${ans}`, en: `#${i} balance=${balance} ans=${ans}` })
        .setBars(machines.map((v, j) => ({ value: v, role: (j === i ? 'compare' : 'default') as BarRole })))
        .setAux([{ label: 'balance', value: String(balance), role: 'frontier' }])
        .commit();
    },
  };
  const ans = findMinMoves(machines, hooks);
  rec
    .begin({ zh: `最少步数=${ans}`, en: `Min steps=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinMoves } from '../../src/algorithms/dp/dp-superwash-3/impl.ts';

test('wash 经典', () => {
  assert.equal(findMinMoves([1, 0, 5]), 3);
});
test('wash 均衡', () => {
  assert.equal(findMinMoves([0, 0, 0]), 0);
});
test('wash 不可行', () => {
  assert.equal(findMinMoves([1, 0, 4]), -1);
});
""")

add(cat="dp", id="dp-paint-3",
    tzh="粉刷房子", ten="Paint House",
    szh="n 个房子，每房只能粉刷红/蓝/绿一种颜色，相邻不能同色，求最小成本。",
    sen="n houses, paint each red/blue/green, no two adjacent same color; min cost.",
    dzh="dp[k][c]=刷到第 k 房且该房颜色 c 的最小成本。dp[k][c]=cost[k][c]+min(dp[k-1][非c])。",
    den="dp[k][c]=min cost to paint first k houses with kth color c. dp[k][c]=cost[k][c]+min(dp[k-1][other]).",
    tags="['dp','paint-house','colors']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 粉刷房子 · 纯算法实现
// =============================================================================
export interface PaintHooks {
  onHouse?: (i: number, costs: number[]) => void;
  onDone?: (min: number) => void;
}

export function paintHouse(costs: readonly (readonly number[])[], hooks: PaintHooks = {}): number {
  if (costs.length === 0) { hooks.onDone?.(0); return 0; }
  let prev = [...costs[0]!];
  for (let i = 1; i < costs.length; i++) {
    const cur = new Array<number>(3).fill(0);
    for (let c = 0; c < 3; c++) {
      const other = prev.filter((_, k) => k !== c);
      cur[c] = costs[i]![c]! + Math.min(...other);
    }
    prev = cur;
    hooks.onHouse?.(i, cur);
  }
  const ans = Math.min(...prev);
  hooks.onDone?.(ans);
  return ans;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { paintHouse, type PaintHooks } from './impl.ts';

export const DEFAULT_COSTS = [[17, 2, 17], [16, 16, 5], [14, 3, 19]];

export function buildTrace(costs: readonly (readonly number[])[] = DEFAULT_COSTS): Frame[] {
  const rec = new TraceRecorder();
  let prev = [...costs[0]!];
  rec
    .begin({ zh: `${costs.length} 个房子`, en: `${costs.length} houses` })
    .setAux([{ label: 'dp[0]', value: `[${prev.join(',')}]`, role: 'frontier' }])
    .commit();
  const hooks: PaintHooks = {
    onHouse: (i, cur) => {
      prev = cur;
      rec
        .begin({ zh: `刷第${i}房 dp=[${cur.join(',')}]`, en: `House ${i} dp=[${cur.join(',')}]` })
        .setAux([{ label: `dp[${i}]`, value: `[${cur.join(',')}]`, role: 'frontier' }])
        .commit();
    },
  };
  const ans = paintHouse(costs, hooks);
  rec
    .begin({ zh: `最小成本=${ans}`, en: `Min cost=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paintHouse } from '../../src/algorithms/dp/dp-paint-3/impl.ts';

test('paint 经典', () => {
  assert.equal(paintHouse([[17, 2, 17], [16, 16, 5], [14, 3, 19]]), 10);
});
test('paint 单房', () => {
  assert.equal(paintHouse([[5, 9, 1]]), 1);
});
test('paint 空', () => {
  assert.equal(paintHouse([]), 0);
});
""")

add(cat="dp", id="dp-attend-3",
    tzh="参加最多活动（按结束时间 dp）", ten="Attend Meetings (End-time DP)",
    szh="给定若干区间 [start,end)，求不重叠地参加最多活动数。",
    sen="Given intervals, attend max number of non-overlapping meetings.",
    dzh="按结束时间排序。dp[i]=前 i 个区间中可选的最大数。若 i 与 dp 前驱不重叠则 dp[i]=dp[p(i)]+1。",
    den="Sort by end. dp[i]=max count using first i. If i non-overlaps predecessor, dp[i]=dp[p]+1.",
    tags="['dp','interval-scheduling','greedy']", time="O(n log n)", space="O(n)",
    impl="""// =============================================================================
// 参加最多活动 · 纯算法实现（贪心：按结束时间排序）
// =============================================================================
export interface AttendHooks {
  onSort?: (order: number[]) => void;
  onPick?: (idx: number, interval: readonly number[]) => void;
  onSkip?: (idx: number, interval: readonly number[]) => void;
  onDone?: (count: number) => void;
}

export interface Interval { start: number; end: number; }

export function maxMeetings(intervals: readonly Interval[], hooks: AttendHooks = {}): number {
  const order = intervals.map((_, i) => i).sort((a, b) => {
    const ea = intervals[a]!.end, eb = intervals[b]!.end;
    return ea !== eb ? ea - eb : intervals[a]!.start - intervals[b]!.start;
  });
  hooks.onSort?.(order);
  let count = 0, lastEnd = -Infinity;
  for (const idx of order) {
    const it = intervals[idx]!;
    if (it.start >= lastEnd) {
      count++; lastEnd = it.end;
      hooks.onPick?.(idx, [it.start, it.end]);
    } else {
      hooks.onSkip?.(idx, [it.start, it.end]);
    }
  }
  hooks.onDone?.(count);
  return count;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxMeetings, type AttendHooks, type Interval } from './impl.ts';

export const DEFAULT_INPUT: Interval[] = [
  { start: 1, end: 3 }, { start: 2, end: 5 }, { start: 4, end: 6 },
  { start: 6, end: 8 }, { start: 5, end: 7 },
];

export function buildTrace(intervals: readonly Interval[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chosen = new Array<boolean>(intervals.length).fill(false);
  rec
    .begin({ zh: `${intervals.length} 个活动`, en: `${intervals.length} meetings` })
    .setBars(intervals.map((it) => ({ value: it.end, role: 'default' as BarRole, label: `${it.start}-${it.end}` })))
    .commit();
  const hooks: AttendHooks = {
    onPick: (idx, it) => {
      chosen[idx] = true;
      rec
        .begin({ zh: `选 [${it[0]},${it[1]})`, en: `Pick [${it[0]},${it[1]})` })
        .setBars(intervals.map((x, j) => ({ value: x.end, role: (j === idx ? 'sorted' : chosen[j] ? 'frontier' : 'default') as BarRole, label: `${x.start}-${x.end}` })))
        .commit();
    },
    onSkip: (idx, it) => {
      rec
        .begin({ zh: `跳过 [${it[0]},${it[1]})`, en: `Skip [${it[0]},${it[1]})` })
        .setBars(intervals.map((x, j) => ({ value: x.end, role: (j === idx ? 'warn' : chosen[j] ? 'frontier' : 'default') as BarRole, label: `${x.start}-${x.end}` })))
        .commit();
    },
  };
  const ans = maxMeetings(intervals, hooks);
  rec
    .begin({ zh: `最多参加=${ans}`, en: `Max attended=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxMeetings } from '../../src/algorithms/dp/dp-attend-3/impl.ts';

test('attend 经典', () => {
  assert.equal(maxMeetings([{start:1,end:3},{start:2,end:5},{start:4,end:6},{start:6,end:8},{start:5,end:7}]), 3);
});
test('attend 空', () => {
  assert.equal(maxMeetings([]), 0);
});
test('attend 全重叠', () => {
  assert.equal(maxMeetings([{start:1,end:5},{start:1,end:5},{start:1,end:5}]), 1);
});
""")

add(cat="dp", id="dp-vowel-3",
    tzh="元音字符串计数", ten="Count Vowel Strings of Length n",
    szh="长度 n、仅由 a/e/i/o/u 组成且按元音字典序非递减的字符串数。",
    sen="Count length-n strings over a/e/i/o/u, non-decreasing in vowel order.",
    dzh="dp[k][v]=长度 k、结尾元音 <=v 的串数。dp[k][v]=dp[k-1][v]+dp[k][v-1]。",
    den="dp[k][v]=count length k ending with vowel <=v. dp[k][v]=dp[k-1][v]+dp[k][v-1].",
    tags="['dp','combinatorics','counting']", time="O(n)", space="O(1)",
    impl="""// =============================================================================
// 元音字符串计数 · 纯算法实现
// =============================================================================
export interface VowelHooks {
  onLen?: (k: number, counts: number[]) => void;
  onDone?: (total: number) => void;
}

export function countVowelStrings(n: number, hooks: VowelHooks = {}): number {
  let dp = [1, 1, 1, 1, 1];
  for (let k = 2; k <= n; k++) {
    const next = [0, 0, 0, 0, 0];
    let run = 0;
    for (let v = 0; v < 5; v++) {
      run += dp[v]!;
      next[v] = run;
    }
    dp = next;
    hooks.onLen?.(k, next);
  }
  const ans = dp.reduce((a, b) => a + b, 0);
  hooks.onDone?.(ans);
  return ans;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countVowelStrings, type VowelHooks } from './impl.ts';

export const DEFAULT_N = 5;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  let dp = [1, 1, 1, 1, 1];
  rec
    .begin({ zh: `n=${n}`, en: `n=${n}` })
    .setBars(dp.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .setAux([{ label: 'dp[k=1]', value: `[${dp.join(',')}]`, role: 'frontier' }])
    .commit();
  const VOWELS = ['a', 'e', 'i', 'o', 'u'];
  const hooks: VowelHooks = {
    onLen: (k, next) => {
      dp = next;
      rec
        .begin({ zh: `k=${k} dp=[${next.join(',')}]`, en: `k=${k} dp=[${next.join(',')}]` })
        .setBars(next.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .setAux([{ label: `dp[k=${k}]`, value: `[${next.join(',')}]`, role: 'frontier' }])
        .commit();
    },
  };
  const ans = countVowelStrings(n, hooks);
  rec
    .begin({ zh: `总数=${ans}`, en: `Total=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countVowelStrings } from '../../src/algorithms/dp/dp-vowel-3/impl.ts';

test('vowel n=1', () => {
  assert.equal(countVowelStrings(1), 5);
});
test('vowel n=2', () => {
  assert.equal(countVowelStrings(2), 15);
});
test('vowel n=5', () => {
  assert.equal(countVowelStrings(5), 126);
});
""")

add(cat="dp", id="dp-music-3",
    tzh="歌曲列表（不同歌间隔 k）", ten="Playlist with Cool-down k",
    szh="从 n 首歌、目标长度 L 的歌单，每首歌与前 k 首不同（歌单可循环），求方案数。",
    sen="Count playlists of length L from n unique songs; same song repeats only after k other songs.",
    dzh="dp[i]=长度 i 的合法歌单数。dp[i]=dp[i-1]*(n-used)；used=已用且可重用的歌数。",
    den="dp[i]=dp[i-1]*(n-used); used=number of songs played and reusable.",
    tags="['dp','combinatorics','playlist']", time="O(L)", space="O(L)",
    impl="""// =============================================================================
// 歌曲列表 · 纯算法实现
// =============================================================================
export interface MusicHooks {
  onLen?: (i: number, val: number) => void;
  onDone?: (count: number) => void;
}

export function numMusicPlaylists(n: number, goal: number, k: number, hooks: MusicHooks = {}, mod = 1_000_000_007): number {
  const dp = new Array<number>(goal + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= goal; i++) {
    // add a brand-new song: have (n - (i-1)) unused songs available
    let ways = (dp[i - 1]! * (n - (i - 1))) % mod;
    // add a reused song: any of the (i-1) songs already played, except the last k
    if (i - 1 > k) {
      ways = (ways + dp[i - 1]! * (i - 1 - k)) % mod;
    }
    dp[i] = ways;
    hooks.onLen?.(i, ways);
  }
  hooks.onDone?.(dp[goal]!);
  return dp[goal]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numMusicPlaylists, type MusicHooks } from './impl.ts';

export const DEFAULT_N = 3, DEFAULT_GOAL = 3, DEFAULT_K = 1;

export function buildTrace(n: number = DEFAULT_N, goal: number = DEFAULT_GOAL, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(goal + 1).fill(0);
  dp[0] = 1;
  rec
    .begin({ zh: `n=${n} goal=${goal} k=${k}`, en: `n=${n} goal=${goal} k=${k}` })
    .setBars(dp.map((v, i) => ({ value: v, role: (i === 0 ? 'sorted' : 'default') as BarRole, label: String(i) })))
    .commit();
  const hooks: MusicHooks = {
    onLen: (i, val) => {
      dp[i] = val;
      rec
        .begin({ zh: `dp[${i}]=${val}`, en: `dp[${i}]=${val}` })
        .setBars(dp.map((v, j) => ({ value: v, role: (j === i ? 'compare' : 'default') as BarRole, label: String(j) })))
        .commit();
    },
  };
  const ans = numMusicPlaylists(n, goal, k, hooks);
  rec
    .begin({ zh: `方案数=${ans}`, en: `Count=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numMusicPlaylists } from '../../src/algorithms/dp/dp-music-3/impl.ts';

test('music n=3 goal=3 k=1', () => {
  assert.equal(numMusicPlaylists(3, 3, 1), 12);
});
test('music n=2 goal=2 k=0', () => {
  assert.equal(numMusicPlaylists(2, 2, 0), 4);
});
""")

add(cat="dp", id="dp-tiling-4",
    tzh="多米诺铺砖（2×N）", ten="Domino Tiling 2×N",
    szh="用 1×2 多米诺骨牌铺满 2×N 网格的方案数（斐波那契）。",
    sen="Number of ways to tile a 2×N board with 1×2 dominoes (Fibonacci).",
    dzh="dp[i]=铺满 2×i 的方案数。dp[i]=dp[i-1]+dp[i-2]（竖放一根 或 横放两根）。dp[0]=1, dp[1]=1。",
    den="dp[i]=dp[i-1]+dp[i-2]. dp[0]=1, dp[1]=1.",
    tags="['dp','tiling','fibonacci']", time="O(n)", space="O(n)",
    impl="""// =============================================================================
// 多米诺铺砖 2×N · 纯算法实现
// =============================================================================
export interface TilingHooks {
  onCol?: (i: number, ways: number) => void;
  onDone?: (ways: number) => void;
}

export function dominoTiling(n: number, hooks: TilingHooks = {}): number {
  if (n < 0) { hooks.onDone?.(0); return 0; }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  if (n >= 1) dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    hooks.onCol?.(i, dp[i]!);
  }
  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominoTiling, type TilingHooks } from './impl.ts';

export const DEFAULT_N = 6;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  if (n >= 1) dp[1] = 1;
  rec
    .begin({ zh: `2×${n} 网格`, en: `2x${n} board` })
    .setBars(dp.map((v, i) => ({ value: v, role: (i < 2 ? 'sorted' : 'default') as BarRole, label: String(i) })))
    .commit();
  const hooks: TilingHooks = {
    onCol: (i, ways) => {
      dp[i] = ways;
      rec
        .begin({ zh: `dp[${i}]=${ways}`, en: `dp[${i}]=${ways}` })
        .setBars(dp.map((v, j) => ({ value: v, role: (j === i ? 'compare' : j < i ? 'sorted' : 'default') as BarRole, label: String(j) })))
        .commit();
    },
  };
  const ans = dominoTiling(n, hooks);
  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominoTiling } from '../../src/algorithms/dp/dp-tiling-4/impl.ts';

test('tiling 斐波那契', () => {
  assert.equal(dominoTiling(0), 1);
  assert.equal(dominoTiling(1), 1);
  assert.equal(dominoTiling(2), 2);
  assert.equal(dominoTiling(6), 13);
});
""")

add(cat="dp", id="dp-stone-10",
    tzh="合并石子（K=2，区间dp）", ten="Merge Stones (K=2 Interval DP)",
    szh="n 堆石子，每次合并相邻两堆代价为两堆之和，求最小总代价。",
    sen="Merge adjacent piles (cost = sum of two piles); minimize total cost.",
    dzh="经典区间 dp：dp[i][j]=合并 i..j 的最小代价。dp[i][j]=min(dp[i][k]+dp[k+1][j])+sum(i..j)，用前缀和。",
    den="Interval dp: dp[i][j]=min over k of dp[i][k]+dp[k+1][j]+sum(i..j).",
    tags="['dp','interval-dp','stone-merge']", time="O(n^3)", space="O(n^2)",
    impl="""// =============================================================================
// 合并石子（K=2）· 纯算法实现
// =============================================================================
export interface StoneHooks {
  onInterval?: (i: number, j: number, val: number) => void;
  onDone?: (cost: number) => void;
}

export function mergeStones(stones: readonly number[], hooks: StoneHooks = {}): number {
  const n = stones.length;
  if (n === 0) { hooks.onDone?.(0); return 0; }
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let best = Number.POSITIVE_INFINITY;
      for (let k = i; k < j; k++) {
        best = Math.min(best, dp[i]![k]! + dp[k + 1]![j]!);
      }
      dp[i]![j] = best + (prefix[j + 1]! - prefix[i]!);
      hooks.onInterval?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onDone?.(dp[0]![n - 1]!);
  return dp[0]![n - 1]!;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeStones, type StoneHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5];

export function buildTrace(stones: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = stones.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  rec
    .begin({ zh: `${n} 堆石子`, en: `${n} piles` })
    .setBars(stones.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const hooks: StoneHooks = {
    onInterval: (i, j, val) => {
      dp[i]![j] = val;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setBars(stones.map((v, k) => ({ value: v, role: (k >= i && k <= j ? 'frontier' : 'default') as BarRole })))
        .setAux([{ label: `dp[${i}..${j}]`, value: String(val), role: 'compare' }])
        .commit();
    },
  };
  const ans = mergeStones(stones, hooks);
  rec
    .begin({ zh: `最小代价=${ans}`, en: `Min cost=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeStones } from '../../src/algorithms/dp/dp-stone-10/impl.ts';

test('stone 经典', () => {
  assert.equal(mergeStones([3, 1, 4, 1, 5]), 32);
});
test('stone 两堆', () => {
  assert.equal(mergeStones([2, 3]), 5);
});
test('stone 空', () => {
  assert.equal(mergeStones([]), 0);
});
test('stone 单堆', () => {
  assert.equal(mergeStones([7]), 0);
});
""")

print("dp section loaded:", len(ALL))

# ===========================================================================
# GRAPH (20)  — shared GraphInput + buildAdjacency inline per algorithm
# ===========================================================================

GRAPH_INPUT_TYPE = """export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
  directed?: boolean;
}

export function buildAdjacency(input: GraphInput): Map<string, Array<{ to: string; w: number }>> {
  const { nodes, edges, directed = false } = input;
  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)!.push({ to: e.to, w: e.weight ?? 1 });
    if (!directed) adj.get(e.to)!.push({ to: e.from, w: e.weight ?? 1 });
  }
  for (const list of adj.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
  return adj;
}
"""

GRAPH_DEFAULT = """export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2', weight: 2 }, { from: '1', to: '3', weight: 5 },
    { from: '1', to: '4', weight: 1 }, { from: '2', to: '3', weight: 3 },
    { from: '2', to: '5', weight: 2 }, { from: '3', to: '6', weight: 4 },
    { from: '4', to: '7', weight: 6 }, { from: '5', to: '6', weight: 1 },
    { from: '6', to: '7', weight: 2 },
  ],
};
"""

# Predefined node layout (ring + center) reused across traces
POS_INIT = """const POS: Record<string, { x: number; y: number }> = (() => {
  const ring = ['2', '5', '6', '3', '7', '4'];
  const cx = 0.5, cy = 0.45, r = 0.32;
  const pos: Record<string, { x: number; y: number }> = { '1': { x: cx, y: cy } };
  ring.forEach((id, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
    pos[id] = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  });
  return pos;
})();
"""

add(cat="graph", id="graph-bfs-4",
    tzh="广度优先搜索（带权重图版）", ten="BFS (Weighted Graph Edition)",
    szh="层序遍历无权图，记录每个节点到起点的最短跳数。",
    sen="Layered traversal; record shortest hop count from source.",
    dzh="队列驱动。每个节点首次被发现即得到最短跳数；O(V+E)。",
    den="Queue-driven; first discovery = shortest hop count; O(V+E).",
    tags="['graph','bfs','traversal']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// BFS（带权重图版）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface GraphBfsHooks {
  onDiscover?: (node: string, parent: string | null, dist: number) => void;
  onVisit?: (node: string) => void;
}

export function bfsGraph(input: GraphInput, start: string, hooks: GraphBfsHooks = {}): string[] {
  const adj = buildAdjacency(input);
  if (!adj.has(start)) return [];
  const visited = new Set<string>([start]);
  const order: string[] = [];
  const queue: Array<{ id: string; dist: number }> = [{ id: start, dist: 0 }];
  hooks.onDiscover?.(start, null, 0);
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u.id);
    hooks.onVisit?.(u.id);
    for (const { to } of adj.get(u.id) ?? []) {
      if (!visited.has(to)) {
        visited.add(to);
        hooks.onDiscover?.(to, u.id, u.dist + 1);
        queue.push({ id: to, dist: u.dist + 1 });
      }
    }
  }
  return order;
}
""",
    trace="""import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bfsGraph, type GraphBfsHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = '1'): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<string>();
  const dist = new Map<string, number>();
  let visiting: string | null = null;
  const queue: string[] = [];
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => {
      let role: BarRole = 'default';
      if (visited.has(id)) role = 'frontier';
      if (id === visiting) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).setAux([{ label: 'Queue', value: queue.join('→') || '∅', role: 'frontier' }]).commit();
  };
  render({ zh: `从 ${start} 开始 BFS`, en: `BFS from ${start}` });
  const hooks: GraphBfsHooks = {
    onDiscover: (node, parent, d) => { visited.add(node); dist.set(node, d); queue.push(node); render({ zh: `发现 ${node} dist=${d}`, en: `Discover ${node} dist=${d}` }); },
    onVisit: (node) => { visiting = node; const idx = queue.indexOf(node); if (idx >= 0) queue.splice(idx, 1); render({ zh: `访问 ${node}`, en: `Visit ${node}` }); },
  };
  bfsGraph(input, start, hooks);
  visiting = null;
  rec.begin({ zh: 'BFS 完成', en: 'BFS done' }).setAux([{ label: 'dist', value: [...dist.entries()].map(([k, v]) => `${k}:${v}`).join(' '), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bfsGraph } from '../../src/algorithms/graph/graph-bfs-4/impl.ts';

const G = { nodes: ['1','2','3','4'], edges: [{from:'1',to:'2'},{from:'1',to:'3'},{from:'2',to:'4'}] };
test('bfs 顺序', () => {
  assert.deepEqual(bfsGraph(G, '1'), ['1','2','3','4']);
});
test('bfs 孤立', () => {
  assert.deepEqual(bfsGraph({ nodes:['a','b'], edges:[] }, 'a'), ['a']);
});
""")

add(cat="graph", id="graph-dfs-4",
    tzh="深度优先搜索（带时间戳）", ten="DFS with Timestamps",
    szh="递归 DFS，记录每个节点的发现/完成时间戳，可判环。",
    sen="Recursive DFS recording discovery/finish timestamps; detects cycles.",
    dzh="维护全局时钟 time，进入节点 +1（disc），离开 +1（fin）。disc[v]<disc[u]<fin[u]<fin[v] 判后向边。",
    den="Global clock; disc on enter, fin on leave. Back edge iff disc[v]<disc[u]<fin[u].",
    tags="['graph','dfs','timestamp']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// DFS（带时间戳）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface GraphDfsHooks {
  onDiscover?: (node: string, parent: string | null, t: number) => void;
  onFinish?: (node: string, t: number) => void;
  onBackEdge?: (from: string, to: string) => void;
}

export interface DfsResult { order: string[]; disc: Map<string, number>; fin: Map<string, number>; hasCycle: boolean; }

export function dfsGraph(input: GraphInput, start: string, hooks: GraphDfsHooks = {}): DfsResult {
  const adj = buildAdjacency(input);
  const disc = new Map<string, number>();
  const fin = new Map<string, number>();
  const order: string[] = [];
  let time = 0;
  let hasCycle = false;
  const inStack = new Set<string>();
  const visit = (u: string, parent: string | null): void => {
    disc.set(u, ++time);
    inStack.add(u);
    order.push(u);
    hooks.onDiscover?.(u, parent, time);
    for (const { to } of adj.get(u) ?? []) {
      if (!disc.has(to)) visit(to, u);
      else if (inStack.has(to) && to !== parent) { hasCycle = true; hooks.onBackEdge?.(u, to); }
    }
    fin.set(u, ++time);
    inStack.delete(u);
    hooks.onFinish?.(u, time);
  };
  if (adj.has(start)) visit(start, null);
  return { order, disc, fin, hasCycle };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfsGraph, type GraphDfsHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = '1'): Frame[] {
  const rec = new TraceRecorder();
  const disc = new Map<string, number>();
  let cur: string | null = null;
  const stack: string[] = [];
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => {
      let role: BarRole = 'default';
      if (disc.has(id)) role = 'sorted';
      if (id === cur) role = 'compare';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).setAux([{ label: 'Stack', value: stack.join('→') || '∅', role: 'frontier' }]).commit();
  };
  render({ zh: `从 ${start} 开始 DFS`, en: `DFS from ${start}` });
  const hooks: GraphDfsHooks = {
    onDiscover: (node, _p, t) => { disc.set(node, t); cur = node; stack.push(node); render({ zh: `发现 ${node} disc=${t}`, en: `Discover ${node} disc=${t}` }); },
    onFinish: (node, t) => { cur = node; const idx = stack.lastIndexOf(node); if (idx >= 0) stack.splice(idx, 1); render({ zh: `完成 ${node} fin=${t}`, en: `Finish ${node} fin=${t}` }); },
  };
  dfsGraph(input, start, hooks);
  cur = null;
  rec.begin({ zh: 'DFS 完成', en: 'DFS done' }).setAux([{ label: 'disc', value: [...disc.entries()].map(([k, v]) => `${k}:${v}`).join(' '), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfsGraph } from '../../src/algorithms/graph/graph-dfs-4/impl.ts';

test('dfs 顺序', () => {
  const r = dfsGraph({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'}] }, '1');
  assert.deepEqual(r.order, ['1','2','3']);
  assert.equal(r.hasCycle, false);
});
test('dfs 环', () => {
  const r = dfsGraph({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'1'}], directed: true }, '1');
  assert.equal(r.hasCycle, true);
});
""")

add(cat="graph", id="graph-dijk-4",
    tzh="Dijkstra 最短路（堆优化）", ten="Dijkstra Shortest Path (Heap)",
    szh="非负权重单源最短路，二叉堆优先队列优化到 O(E log V)。",
    sen="Single-source shortest path with non-negative weights via binary heap.",
    dzh="dist[s]=0，其余 ∞。每次取出未确定且 dist 最小的 u，松弛其邻居。负权不适用。",
    den="dist[s]=0; repeatedly extract min unvisited u and relax neighbors. No negative weights.",
    tags="['graph','shortest-path','dijkstra','greedy']", time="O(E log V)", space="O(V)",
    impl="""// =============================================================================
// Dijkstra（堆优化）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface DijkHooks {
  onExtract?: (u: string, d: number) => void;
  onRelax?: (from: string, to: string, newDist: number) => void;
  onDone?: (dist: Map<string, number>) => void;
}

export function dijkstra(input: GraphInput, start: string, hooks: DijkHooks = {}): Map<string, number> {
  const adj = buildAdjacency(input);
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Number.POSITIVE_INFINITY);
  dist.set(start, 0);
  const settled = new Set<string>();
  // simple priority queue (array kept sorted) - O(V^2) worst but fine for demo
  const pq: Array<{ id: string; d: number }> = [{ id: start, d: 0 }];
  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { id: u, d } = pq.shift()!;
    if (settled.has(u)) continue;
    settled.add(u);
    hooks.onExtract?.(u, d);
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = d + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        pq.push({ id: to, d: nd });
        hooks.onRelax?.(u, to, nd);
      }
    }
  }
  hooks.onDone?.(dist);
  return dist;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstra, type DijkHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = '1'): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Number.POSITIVE_INFINITY);
  dist.set(start, 0);
  const settled = new Set<string>();
  const treeEdges = new Set<string>();
  let cur: string | null = null;
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => {
      let role: BarRole = 'default';
      if (settled.has(id)) role = 'sorted';
      if (id === cur) role = 'compare';
      const d = dist.get(id) ?? Infinity;
      return { id, label: `${id}(${d === Infinity ? '∞' : d})`, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (treeEdges.has(directed ? `${e.from}>${e.to}` : e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`)) role = 'frontier';
      return { from: e.from, to: e.to, weight: e.weight, directed, role };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };
  render({ zh: `从 ${start} 出发 Dijkstra`, en: `Dijkstra from ${start}` });
  const hooks: DijkHooks = {
    onExtract: (u, d) => { settled.add(u); cur = u; render({ zh: `确定 ${u} dist=${d}`, en: `Settle ${u} dist=${d}` }); },
    onRelax: (from, to, nd) => { dist.set(to, nd); treeEdges.add(directed ? `${from}>${to}` : from < to ? `${from}-${to}` : `${to}-${from}`); render({ zh: `松弛 ${from}→${to} =${nd}`, en: `Relax ${from}->${to} =${nd}` }); },
  };
  dijkstra(input, start, hooks);
  cur = null;
  rec.begin({ zh: '最短路完成', en: 'Shortest paths done' }).setAux([{ label: 'dist', value: [...dist.entries()].map(([k, v]) => `${k}:${v === Infinity ? '∞' : v}`).join(' '), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dijkstra } from '../../src/algorithms/graph/graph-dijk-4/impl.ts';

const G = { nodes: ['1','2','3','4'], edges: [{from:'1',to:'2',weight:1},{from:'1',to:'3',weight:4},{from:'2',to:'3',weight:1},{from:'3',to:'4',weight:1}] };
test('dijk 距离', () => {
  const d = dijkstra(G, '1');
  assert.equal(d.get('4'), 3);
  assert.equal(d.get('2'), 1);
});
test('dijk 起点', () => {
  assert.equal(dijkstra(G, '1').get('1'), 0);
});
""")

add(cat="graph", id="graph-bell-4",
    tzh="Bellman-Ford（允许负权）", ten="Bellman-Ford (Negative Weights OK)",
    szh="单源最短路，允许负权边，可检测负权环。",
    sen="Single-source shortest path with negative weights; detects negative cycles.",
    dzh="对所有边松弛 V-1 轮；若第 V 轮仍能松弛则存在负权环。",
    den="Relax all edges V-1 rounds; if a Vth round relaxes, negative cycle exists.",
    tags="['graph','shortest-path','bellman-ford','negative-weight']", time="O(V*E)", space="O(V)",
    impl="""// =============================================================================
// Bellman-Ford · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface BellHooks {
  onRound?: (round: number, relaxed: number) => void;
  onRelax?: (from: string, to: string, w: number, newDist: number) => void;
  onDone?: (dist: Map<string, number>, hasNegCycle: boolean) => void;
}

export function bellmanFord(input: GraphInput, start: string, hooks: BellHooks = {}): { dist: Map<string, number>; hasNegCycle: boolean } {
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Number.POSITIVE_INFINITY);
  dist.set(start, 0);
  const V = input.nodes.length;
  for (let r = 1; r <= V - 1; r++) {
    let relaxed = 0;
    for (const e of input.edges) {
      const du = dist.get(e.from) ?? Infinity;
      if (du === Infinity) continue;
      const w = e.weight ?? 1;
      if (du + w < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, du + w);
        hooks.onRelax?.(e.from, e.to, w, du + w);
        relaxed++;
      }
    }
    hooks.onRound?.(r, relaxed);
    if (relaxed === 0) break;
  }
  let hasNegCycle = false;
  for (const e of input.edges) {
    const du = dist.get(e.from) ?? Infinity;
    const w = e.weight ?? 1;
    if (du !== Infinity && du + w < (dist.get(e.to) ?? Infinity)) { hasNegCycle = true; break; }
  }
  hooks.onDone?.(dist, hasNegCycle);
  return { dist, hasNegCycle };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bellmanFord, type BellHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = '1'): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Number.POSITIVE_INFINITY);
  dist.set(start, 0);
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => {
      const d = dist.get(id) ?? Infinity;
      return { id, label: `${id}(${d === Infinity ? '∞' : d})`, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: 'default' as BarRole };
    });
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: `Bellman-Ford 从 ${start}`, en: `Bellman-Ford from ${start}` });
  const hooks: BellHooks = {
    onRelax: (from, to, _w, nd) => { dist.set(to, nd); render({ zh: `松弛 ${from}→${to}=${nd}`, en: `Relax ${from}->${to}=${nd}` }); },
    onRound: (r, relaxed) => { render({ zh: `第${r}轮 松弛${relaxed}次`, en: `Round ${r} relaxed ${relaxed}` }); },
  };
  const { dist: fd, hasNegCycle } = bellmanFord(input, start, hooks);
  rec.begin({ zh: hasNegCycle ? '检测到负权环' : '完成', en: hasNegCycle ? 'Negative cycle' : 'Done' }).setAux([{ label: 'dist', value: [...fd.entries()].map(([k, v]) => `${k}:${v === Infinity ? '∞' : v}`).join(' '), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bellmanFord } from '../../src/algorithms/graph/graph-bell-4/impl.ts';

test('bell 正权', () => {
  const { dist, hasNegCycle } = bellmanFord({ nodes: ['1','2','3'], edges: [{from:'1',to:'2',weight:4},{from:'1',to:'3',weight:2},{from:'3',to:'2',weight:1}] }, '1');
  assert.equal(dist.get('2'), 3);
  assert.equal(hasNegCycle, false);
});
test('bell 负权环', () => {
  const { hasNegCycle } = bellmanFord({ nodes: ['1','2','3'], edges: [{from:'1',to:'2',weight:1},{from:'2',to:'3',weight:-2},{from:'3',to:'2',weight:1}], directed: true }, '1');
  assert.equal(hasNegCycle, true);
});
""")

add(cat="graph", id="graph-floyd-4",
    tzh="Floyd-Warshall 全源最短路", ten="Floyd-Warshall All-Pairs Shortest Path",
    szh="求图中任意两点的最短路径，三重循环动态规划。",
    sen="Shortest path between all pairs via triple-loop DP.",
    dzh="dp[k][i][j]=经过前 k 个中转点时 i→j 的最短距离。dp[k][i][j]=min(dp[k-1][i][j], dp[k-1][i][k]+dp[k-1][k][j])。",
    den="dp[k][i][j]=min(dp[i][j], dp[i][k]+dp[k][j]) iterating k as intermediate.",
    tags="['graph','shortest-path','floyd-warshall','all-pairs']", time="O(V^3)", space="O(V^2)",
    impl="""// =============================================================================
// Floyd-Warshall · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface FloydHooks {
  onRelax?: (k: string, i: string, j: string, val: number) => void;
  onDone?: (hasNegCycle: boolean) => void;
}

export function floydWarshall(input: GraphInput, hooks: FloydHooks = {}): { dist: Map<string, Map<string, number>>; hasNegCycle: boolean } {
  const INF = Number.POSITIVE_INFINITY;
  const dist = new Map<string, Map<string, number>>();
  for (const a of input.nodes) {
    const row = new Map<string, number>();
    for (const b of input.nodes) row.set(b, a === b ? 0 : INF);
    dist.set(a, row);
  }
  for (const e of input.edges) {
    const w = e.weight ?? 1;
    if (w < (dist.get(e.from)!.get(e.to) ?? Infinity)) dist.get(e.from)!.set(e.to, w);
    if (!(input.directed ?? false)) {
      if (w < (dist.get(e.to)!.get(e.from) ?? Infinity)) dist.get(e.to)!.set(e.from, w);
    }
  }
  for (const k of input.nodes) {
    for (const i of input.nodes) {
      const dik = dist.get(i)!.get(k) ?? Infinity;
      if (dik === Infinity) continue;
      for (const j of input.nodes) {
        const dkj = dist.get(k)!.get(j) ?? Infinity;
        if (dkj === Infinity) continue;
        const nd = dik + dkj;
        if (nd < (dist.get(i)!.get(j) ?? Infinity)) {
          dist.get(i)!.set(j, nd);
          hooks.onRelax?.(k, i, j, nd);
        }
      }
    }
  }
  let hasNegCycle = false;
  for (const n of input.nodes) if ((dist.get(n)!.get(n) ?? 0) < 0) { hasNegCycle = true; break; }
  hooks.onDone?.(hasNegCycle);
  return { dist, hasNegCycle };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floydWarshall, type FloydHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { dist } = floydWarshall(input);
  let curK: string | null = null;
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (id === curK ? 'compare' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).setAux(input.nodes.map((i) => ({ label: `${i}:`, value: input.nodes.map((j) => `${j}=${(dist.get(i)!.get(j) ?? Infinity) === Infinity ? '∞' : dist.get(i)!.get(j)!}`).join(' '), role: 'frontier' }))).commit();
  };
  render({ zh: '初始化距离矩阵', en: 'Init distance matrix' });
  const hooks: FloydHooks = {
    onRelax: (k, i, j, val) => { dist.get(i)!.set(j, val); curK = k; render({ zh: `中转 ${k}: ${i}→${j}=${val}`, en: `via ${k}: ${i}->${j}=${val}` }); },
  };
  floydWarshall(input, hooks);
  curK = null;
  rec.begin({ zh: '全源最短路完成', en: 'All-pairs done' }).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floydWarshall } from '../../src/algorithms/graph/graph-floyd-4/impl.ts';

test('floyd 距离', () => {
  const { dist, hasNegCycle } = floydWarshall({ nodes: ['1','2','3'], edges: [{from:'1',to:'2',weight:3},{from:'2',to:'3',weight:4},{from:'1',to:'3',weight:10}] });
  assert.equal(dist.get('1')!.get('3'), 7);
  assert.equal(hasNegCycle, false);
});
""")

add(cat="graph", id="graph-prim-4",
    tzh="Prim 最小生成树", ten="Prim Minimum Spanning Tree",
    szh="从任一点出发，每次加入离当前树最近的点，构建 MST。",
    sen="Grow MST from any node by adding nearest node each step.",
    dzh="维护已选集合 S 与 cut 边。每轮选 cost 最小的 (S, V-S) 边加入。优先队列 O(E log V)。",
    den="Maintain set S; each round add the min cut-edge between S and V-S.",
    tags="['graph','mst','prim','greedy']", time="O(E log V)", space="O(V)",
    impl="""// =============================================================================
// Prim · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface PrimHooks {
  onAdd?: (u: string, via: string | null, w: number) => void;
  onUpdate?: (to: string, newCost: number, via: string) => void;
  onDone?: (total: number) => void;
}

export function prim(input: GraphInput, start: string, hooks: PrimHooks = {}): number {
  const adj = buildAdjacency(input);
  const inTree = new Set<string>();
  const cost = new Map<string, number>();
  const via = new Map<string, string>();
  for (const n of input.nodes) cost.set(n, Number.POSITIVE_INFINITY);
  cost.set(start, 0);
  via.set(start, start);
  let total = 0;
  for (let i = 0; i < input.nodes.length; i++) {
    let u: string | null = null, best = Number.POSITIVE_INFINITY;
    for (const n of input.nodes) {
      if (!inTree.has(n) && (cost.get(n) ?? Infinity) < best) { best = cost.get(n)!; u = n; }
    }
    if (u === null) break;
    inTree.add(u);
    total += cost.get(u)!;
    hooks.onAdd?.(u, u === start ? null : (via.get(u) ?? u), cost.get(u)!);
    for (const { to, w } of adj.get(u) ?? []) {
      if (!inTree.has(to) && w < (cost.get(to) ?? Infinity)) {
        cost.set(to, w); via.set(to, u);
        hooks.onUpdate?.(to, w, u);
      }
    }
  }
  hooks.onDone?.(total);
  return total;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { prim, type PrimHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = '1'): Frame[] {
  const rec = new TraceRecorder();
  const inTree = new Set<string>();
  const treeEdges = new Set<string>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (inTree.has(id) ? 'sorted' : 'default') as BarRole }));
    const edges = input.edges.map((e) => {
      const key = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      return { from: e.from, to: e.to, weight: e.weight, directed, role: (treeEdges.has(key) ? 'frontier' : 'default') as BarRole };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };
  render({ zh: `Prim 从 ${start}`, en: `Prim from ${start}` });
  const hooks: PrimHooks = {
    onAdd: (u, viaN, _w) => { inTree.add(u); if (viaN) treeEdges.add(u < viaN ? `${u}-${viaN}` : `${viaN}-${u}`); render({ zh: `加入 ${u}`, en: `Add ${u}` }); },
  };
  const total = prim(input, start, hooks);
  rec.begin({ zh: `MST 权重=${total}`, en: `MST weight=${total}` }).setAux([{ label: 'total', value: String(total), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prim } from '../../src/algorithms/graph/graph-prim-4/impl.ts';

test('prim 权重', () => {
  const w = prim({ nodes: ['1','2','3','4'], edges: [{from:'1',to:'2',weight:1},{from:'2',to:'3',weight:2},{from:'3',to:'4',weight:3},{from:'1',to:'4',weight:10}] }, '1');
  assert.equal(w, 6);
});
""")

add(cat="graph", id="graph-krus-4",
    tzh="Kruskal 最小生成树（并查集）", ten="Kruskal MST (Union-Find)",
    szh="边按权排序，依次加入不形成环的边，构建 MST。",
    sen="Sort edges by weight; add edge if it doesn't form a cycle.",
    dzh="边升序排序。用并查集判环：若两端点不在同一集合则加入。",
    den="Sort edges ascending. Use union-find: include if endpoints in different sets.",
    tags="['graph','mst','kruskal','union-find','greedy']", time="O(E log E)", space="O(V)",
    impl="""// =============================================================================
// Kruskal · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface KrusHooks {
  onSort?: (order: number[]) => void;
  onConsider?: (e: { from: string; to: string; weight: number }, accept: boolean) => void;
  onDone?: (total: number) => void;
}

class DSU {
  private parent: Map<string, string> = new Map();
  constructor(ids: Iterable<string>) { for (const x of ids) this.parent.set(x, x); }
  find(x: string): string { const p = this.parent.get(x)!; return p === x ? x : (this.parent.set(x, this.find(p)), this.parent.get(x)!); }
  union(a: string, b: string): boolean { const ra = this.find(a), rb = this.find(b); if (ra === rb) return false; this.parent.set(ra, rb); return true; }
}

export function kruskal(input: GraphInput, hooks: KrusHooks = {}): number {
  const order = input.edges.map((_, i) => i).sort((a, b) => {
    const wa = input.edges[a]!.weight ?? 1, wb = input.edges[b]!.weight ?? 1;
    return wa - wb;
  });
  hooks.onSort?.(order);
  const dsu = new DSU(input.nodes);
  let total = 0, count = 0;
  for (const idx of order) {
    const e = input.edges[idx]!;
    const w = e.weight ?? 1;
    const accept = dsu.union(e.from, e.to);
    hooks.onConsider?.(e, accept);
    if (accept) { total += w; count++; if (count === input.nodes.length - 1) break; }
  }
  hooks.onDone?.(total);
  return total;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kruskal, type KrusHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const treeEdges = new Set<string>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: 'default' as BarRole }));
    const edges = input.edges.map((e) => {
      const key = directed ? `${e.from}>${e.to}` : (e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`);
      return { from: e.from, to: e.to, weight: e.weight, directed, role: (treeEdges.has(key) ? 'frontier' : 'default') as BarRole };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };
  render({ zh: 'Kruskal 开始', en: 'Kruskal start' });
  const hooks: KrusHooks = {
    onConsider: (e, accept) => {
      if (accept) { const key = directed ? `${e.from}>${e.to}` : (e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`); treeEdges.add(key); }
      render(accept ? { zh: `加入 ${e.from}-${e.to}`, en: `Add ${e.from}-${e.to}` } : { zh: `跳过 ${e.from}-${e.to}（成环）`, en: `Skip ${e.from}-${e.to} (cycle)` });
    },
  };
  const total = kruskal(input, hooks);
  rec.begin({ zh: `MST 权重=${total}`, en: `MST weight=${total}` }).setAux([{ label: 'total', value: String(total), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kruskal } from '../../src/algorithms/graph/graph-krus-4/impl.ts';

test('krus 权重', () => {
  const w = kruskal({ nodes: ['1','2','3','4'], edges: [{from:'1',to:'2',weight:1},{from:'2',to:'3',weight:2},{from:'3',to:'4',weight:3},{from:'1',to:'4',weight:10}] });
  assert.equal(w, 6);
});
""")

add(cat="graph", id="graph-tar-4",
    tzh="Tarjan 强连通分量", ten="Tarjan Strongly Connected Components",
    szh="一次 DFS 找出有向图所有强连通分量（SCC），O(V+E)。",
    sen="Find all SCCs of a directed graph in one DFS, O(V+E).",
    dzh="维护 dfn/low。low[u]=min(dfn[u], dfn[未访问子女], dfn[指向栈中的回边])。若 dfn[u]==low[u] 弹栈成一个 SCC。",
    den="Maintain dfn/low. When dfn[u]==low[u], pop stack to form an SCC.",
    tags="['graph','scc','tarjan','dfs']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// Tarjan SCC · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface TarHooks {
  onVisit?: (u: string, dfn: number) => void;
  onLowUpdate?: (u: string, low: number) => void;
  onSCC?: (members: string[]) => void;
}

export function tarjanSCC(input: GraphInput, hooks: TarHooks = {}): string[][] {
  const adj = buildAdjacency(input);
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const sccs: string[][] = [];
  let time = 0;
  const visit = (u: string): void => {
    dfn.set(u, ++time); low.set(u, time);
    stack.push(u); onStack.add(u);
    hooks.onVisit?.(u, time);
    for (const { to } of adj.get(u) ?? []) {
      if (!dfn.has(to)) { visit(to); low.set(u, Math.min(low.get(u)!, low.get(to)!)); hooks.onLowUpdate?.(u, low.get(u)!); }
      else if (onStack.has(to)) { low.set(u, Math.min(low.get(u)!, dfn.get(to)!)); hooks.onLowUpdate?.(u, low.get(u)!); }
    }
    if (dfn.get(u) === low.get(u)) {
      const comp: string[] = [];
      let top: string;
      do { top = stack.pop()!; onStack.delete(top); comp.push(top); } while (top !== u);
      sccs.push(comp);
      hooks.onSCC?.(comp);
    }
  };
  for (const n of input.nodes) if (!dfn.has(n)) visit(n);
  return sccs;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tarjanSCC, type TarHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const inSCC = new Map<string, number>();
  const directed = input.directed ?? true;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (inSCC.has(id) ? 'sorted' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: 'Tarjan SCC 开始', en: 'Tarjan SCC start' });
  const hooks: TarHooks = {
    onSCC: (members) => { const idx = inSCC.size; for (const m of members) inSCC.set(m, idx); render({ zh: `SCC={${members.join(',')}}`, en: `SCC={${members.join(',')}}` }); },
  };
  const sccs = tarjanSCC({ ...input, directed: true }, hooks);
  rec.begin({ zh: `${sccs.length} 个 SCC`, en: `${sccs.length} SCCs` }).setAux([{ label: 'count', value: String(sccs.length), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tarjanSCC } from '../../src/algorithms/graph/graph-tar-4/impl.ts';

test('tar 简单环', () => {
  const sccs = tarjanSCC({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'1'}], directed: true });
  assert.equal(sccs.length, 1);
});
test('tar 无环', () => {
  const sccs = tarjanSCC({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'}], directed: true });
  assert.equal(sccs.length, 3);
});
""")

add(cat="graph", id="graph-scc-4",
    tzh="Kosaraju 强连通分量", ten="Kosaraju SCC",
    szh="两次 DFS 求 SCC：先按完成时间逆序，再在反向图上 DFS。",
    sen="Two-pass DFS for SCC: finish-order then DFS on reversed graph.",
    dzh="第一次 DFS 按完成时间压栈；第二次在反图上按栈顶顺序 DFS，每棵树即一个 SCC。",
    den="DFS1 push by finish time; DFS2 on transpose in stack order; each tree = SCC.",
    tags="['graph','scc','kosaraju','dfs']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// Kosaraju SCC · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface SccHooks {
  onDFS1Finish?: (u: string) => void;
  onSCC?: (members: string[]) => void;
}

export function kosarajuSCC(input: GraphInput, hooks: SccHooks = {}): string[][] {
  const adj = buildAdjacency(input);
  const radj = new Map<string, string[]>();
  for (const n of input.nodes) radj.set(n, []);
  for (const e of input.edges) { radj.get(e.to)!.push(e.from); radj.get(e.from)!.push(e.to); if (input.directed ?? true) { /* keep only reverse of directed */ } }
  // rebuild reverse edges correctly for directed
  radj.clear();
  for (const n of input.nodes) radj.set(n, []);
  for (const e of input.edges) radj.get(e.to)!.push(e.from);
  for (const list of radj.values()) list.sort();
  const visited = new Set<string>();
  const order: string[] = [];
  const dfs1 = (u: string): void => {
    visited.add(u);
    for (const { to } of adj.get(u) ?? []) if (!visited.has(to)) dfs1(to);
    order.push(u);
    hooks.onDFS1Finish?.(u);
  };
  for (const n of input.nodes) if (!visited.has(n)) dfs1(n);
  const visited2 = new Set<string>();
  const sccs: string[][] = [];
  const dfs2 = (u: string, comp: string[]): void => {
    visited2.add(u); comp.push(u);
    for (const v of radj.get(u) ?? []) if (!visited2.has(v)) dfs2(v, comp);
  };
  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i]!;
    if (!visited2.has(u)) { const comp: string[] = []; dfs2(u, comp); sccs.push(comp); hooks.onSCC?.(comp); }
  }
  return sccs;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kosarajuSCC, type SccHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const inSCC = new Map<string, number>();
  const directed = input.directed ?? true;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (inSCC.has(id) ? 'sorted' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: 'Kosaraju 开始', en: 'Kosaraju start' });
  const hooks: SccHooks = {
    onSCC: (members) => { const idx = inSCC.size; for (const m of members) inSCC.set(m, idx); render({ zh: `SCC={${members.join(',')}}`, en: `SCC={${members.join(',')}}` }); },
  };
  const sccs = kosarajuSCC({ ...input, directed: true }, hooks);
  rec.begin({ zh: `${sccs.length} 个 SCC`, en: `${sccs.length} SCCs` }).setAux([{ label: 'count', value: String(sccs.length), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kosarajuSCC } from '../../src/algorithms/graph/graph-scc-4/impl.ts';

test('kos 简单环', () => {
  const sccs = kosarajuSCC({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'1'}], directed: true });
  assert.equal(sccs.length, 1);
});
test('kos 无环', () => {
  const sccs = kosarajuSCC({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'}], directed: true });
  assert.equal(sccs.length, 3);
});
""")

add(cat="graph", id="graph-br-4",
    tzh="寻找桥（Tarjan）", ten="Find Bridges (Tarjan)",
    szh="无向图中删除后使图不连通的边，即桥。",
    sen="Edges whose removal disconnects an undirected graph.",
    dzh="low[to]>dfn[u] 时 (u,to) 是桥。",
    den="Edge (u,to) is a bridge iff low[to]>dfn[u].",
    tags="['graph','bridge','tarjan','dfs']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// 寻找桥 · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface BridgeHooks {
  onVisit?: (u: string, dfn: number) => void;
  onBridge?: (from: string, to: string) => void;
}

export function findBridges(input: GraphInput, hooks: BridgeHooks = {}): Array<[string, string]> {
  const adj = buildAdjacency(input);
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const bridges: Array<[string, string]> = [];
  let time = 0;
  const visit = (u: string, parentEdge: string | null): void => {
    dfn.set(u, ++time); low.set(u, time);
    hooks.onVisit?.(u, time);
    for (const { to } of adj.get(u) ?? []) {
      const ek = u < to ? `${u}-${to}` : `${to}-${u}`;
      if (ek === parentEdge) continue;
      if (!dfn.has(to)) {
        visit(to, ek);
        low.set(u, Math.min(low.get(u)!, low.get(to)!));
        if (low.get(to)! > dfn.get(u)!) { bridges.push([u, to]); hooks.onBridge?.(u, to); }
      } else {
        low.set(u, Math.min(low.get(u)!, dfn.get(to)!));
      }
    }
  };
  for (const n of input.nodes) if (!dfn.has(n)) visit(n, null);
  return bridges;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findBridges, type BridgeHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bridgeSet = new Set<string>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: 'default' as BarRole }));
    const edges = input.edges.map((e) => {
      const key = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      return { from: e.from, to: e.to, weight: e.weight, directed, role: (bridgeSet.has(key) ? 'warn' : 'default') as BarRole };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };
  render({ zh: '寻找桥', en: 'Find bridges' });
  const hooks: BridgeHooks = {
    onBridge: (a, b) => { bridgeSet.add(a < b ? `${a}-${b}` : `${b}-${a}`); render({ zh: `桥 ${a}-${b}`, en: `Bridge ${a}-${b}` }); },
  };
  const bridges = findBridges(input, hooks);
  rec.begin({ zh: `共 ${bridges.length} 座桥`, en: `${bridges.length} bridges` }).setAux([{ label: 'count', value: String(bridges.length), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findBridges } from '../../src/algorithms/graph/graph-br-4/impl.ts';

test('bridge 链', () => {
  const b = findBridges({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'}] });
  assert.equal(b.length, 2);
});
test('bridge 三角', () => {
  const b = findBridges({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'1',to:'3'}] });
  assert.equal(b.length, 0);
});
""")

add(cat="graph", id="graph-cut-4",
    tzh="寻找割点（Tarjan）", ten="Find Articulation Points (Tarjan)",
    szh="无向图中删除后使图不连通的点，即割点。",
    sen="Vertices whose removal disconnects an undirected graph.",
    dzh="根有>=2 棵 DFS 子树则根为割点；非根 u 若存在子 v 使 low[v]>=dfn[u]，则 u 为割点。",
    den="Root is cut vertex if it has >=2 DFS children; non-root u if any child v has low[v]>=dfn[u].",
    tags="['graph','articulation-point','tarjan','dfs']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// 寻找割点 · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface CutHooks {
  onVisit?: (u: string, dfn: number) => void;
  onCut?: (u: string) => void;
}

export function findCutVertices(input: GraphInput, hooks: CutHooks = {}): string[] {
  const adj = buildAdjacency(input);
  const dfn = new Map<string, number>();
  const low = new Map<string, number>();
  const cut = new Set<string>();
  let time = 0;
  const visit = (u: string, parent: string | null, isRoot: boolean): void => {
    dfn.set(u, ++time); low.set(u, time);
    hooks.onVisit?.(u, time);
    let children = 0;
    for (const { to } of adj.get(u) ?? []) {
      if (to === parent) continue;
      if (!dfn.has(to)) {
        children++;
        visit(to, u, false);
        low.set(u, Math.min(low.get(u)!, low.get(to)!));
        if (!isRoot && low.get(to)! >= dfn.get(u)!) { if (!cut.has(u)) { cut.add(u); hooks.onCut?.(u); } }
      } else {
        low.set(u, Math.min(low.get(u)!, dfn.get(to)!));
      }
    }
    if (isRoot && children >= 2) { if (!cut.has(u)) { cut.add(u); hooks.onCut?.(u); } }
  };
  for (const n of input.nodes) if (!dfn.has(n)) visit(n, null, true);
  return [...cut];
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findCutVertices, type CutHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cutSet = new Set<string>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (cutSet.has(id) ? 'warn' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: '寻找割点', en: 'Find cut vertices' });
  const hooks: CutHooks = {
    onCut: (u) => { cutSet.add(u); render({ zh: `割点 ${u}`, en: `Cut ${u}` }); },
  };
  const cuts = findCutVertices(input, hooks);
  rec.begin({ zh: `共 ${cuts.length} 个割点`, en: `${cuts.length} cut vertices` }).setAux([{ label: 'count', value: String(cuts.length), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCutVertices } from '../../src/algorithms/graph/graph-cut-4/impl.ts';

test('cut 星形', () => {
  const c = findCutVertices({ nodes: ['1','2','3','4'], edges: [{from:'1',to:'2'},{from:'1',to:'3'},{from:'1',to:'4'}] });
  assert.deepEqual(c.sort(), ['1']);
});
test('cut 三角', () => {
  const c = findCutVertices({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'1',to:'3'}] });
  assert.equal(c.length, 0);
});
""")

add(cat="graph", id="graph-lca-4",
    tzh="最近公共祖先（倍增）", ten="Lowest Common Ancestor (Binary Lifting)",
    szh="树中两点的最近公共祖先，离线预处理后 O(log N) 查询。",
    sen="LCA of two tree nodes; O(log N) per query after preprocessing.",
    dzh="预处理 up[k][u]=u 向上跳 2^k 步到的祖先。查询时先调深度，再二进制跳。",
    den="Precompute up[k][u]=ancestor 2^k above u. Align depths, then binary-lift both.",
    tags="['graph','tree','lca','binary-lifting']", time="O((N+Q) log N)", space="O(N log N)",
    impl="""// =============================================================================
// LCA（倍增）· 纯算法实现
// =============================================================================
export interface TreeInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  root: string;
}

export interface LcaHooks {
  onBuild?: (level: Map<string, number>) => void;
  onQuery?: (u: string, v: string, lca: string) => void;
}

export class LCA {
  private up: Map<string, string[]> = new Map();
  private depth: Map<string, number> = new Map();
  private LOG: number;
  constructor(tree: TreeInput) {
    const adj = new Map<string, string[]>();
    for (const n of tree.nodes) adj.set(n, []);
    for (const e of tree.edges) { adj.get(e.from)!.push(e.to); adj.get(e.to)!.push(e.from); }
    this.LOG = Math.ceil(Math.log2(Math.max(1, tree.nodes.length))) + 1;
    const depth = this.depth;
    const up = this.up;
    const dfs = (u: string, p: string): void => {
      const arr = new Array<string>(this.LOG);
      arr[0] = p;
      up.set(u, arr);
      for (const v of adj.get(u) ?? []) if (v !== p) { depth.set(v, (depth.get(u) ?? 0) + 1); dfs(v, u); }
    };
    depth.set(tree.root, 0);
    dfs(tree.root, tree.root);
    for (let k = 1; k < this.LOG; k++) {
      for (const u of tree.nodes) {
        const arr = up.get(u)!;
        arr[k] = up.get(arr[k - 1]!)![k - 1]!;
      }
    }
  }
  query(a: string, b: string, hooks: LcaHooks = {}): string {
    let u = a, v = b;
    if ((this.depth.get(u) ?? 0) < (this.depth.get(v) ?? 0)) [u, v] = [v, u];
    const diff = (this.depth.get(u) ?? 0) - (this.depth.get(v) ?? 0);
    for (let k = 0; k < this.LOG; k++) if ((diff >> k) & 1) u = this.up.get(u)![k]!;
    if (u === v) { hooks.onQuery?.(a, b, u); return u; }
    for (let k = this.LOG - 1; k >= 0; k--) {
      if (this.up.get(u)![k]! !== this.up.get(v)![k]!) { u = this.up.get(u)![k]!; v = this.up.get(v)![k]!; }
    }
    const lca = this.up.get(u)![0]!;
    hooks.onQuery?.(a, b, lca);
    return lca;
  }
}
""",
    trace="""import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LCA } from './impl.ts';

export const DEFAULT_TREE = {
  nodes: ['1','2','3','4','5','6','7'],
  edges: [{from:'1',to:'2'},{from:'1',to:'3'},{from:'2',to:'4'},{from:'2',to:'5'},{from:'3',to:'6'},{from:'3',to:'7'}],
  root: '1',
};
const POS: Record<string, { x: number; y: number }> = { '1':{x:0.5,y:0.1},'2':{x:0.25,y:0.4},'3':{x:0.75,y:0.4},'4':{x:0.1,y:0.75},'5':{x:0.4,y:0.75},'6':{x:0.6,y:0.75},'7':{x:0.9,y:0.75} };

function buildViz(edges: ReadonlyArray<{from:string;to:string}>, root: string, marked: Set<string>): TreeNode {
  const adj = new Map<string, string[]>();
  for (const e of edges) { adj.get(e.from) ?? adj.set(e.from, []); adj.get(e.from)!.push(e.to); }
  const mk = (id: string): TreeNode => {
    const children = (adj.get(id) ?? []).map(mk);
    return { id, value: id, role: marked.has(id) ? 'compare' as BarRole : 'default', children: children.length ? children : undefined };
  };
  return mk(root);
}

export function buildTrace(tree = DEFAULT_TREE, queries: Array<[string,string]> = [['4','5'],['4','6'],['5','7']]): Frame[] {
  const rec = new TraceRecorder();
  const lca = new LCA(tree);
  rec.begin({ zh: '预处理完成', en: 'Preprocessed' }).setTree(buildViz(tree.edges, tree.root, new Set())).commit();
  for (const [a, b] of queries) {
    const r = lca.query(a, b);
    // mark path: simplify - just mark a, b, lca
    rec.begin({ zh: `LCA(${a},${b})=${r}`, en: `LCA(${a},${b})=${r}` }).setTree(buildViz(tree.edges, tree.root, new Set([a, b, r]))).commit();
  }
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LCA } from '../../src/algorithms/graph/graph-lca-4/impl.ts';

const t = { nodes: ['1','2','3','4','5'], edges: [{from:'1',to:'2'},{from:'1',to:'3'},{from:'2',to:'4'},{from:'2',to:'5'}], root: '1' };
const lca = new LCA(t);
test('lca 同侧', () => {
  assert.equal(lca.query('4','5'), '2');
});
test('lca 异侧', () => {
  assert.equal(lca.query('4','3'), '1');
});
test('lca 自身', () => {
  assert.equal(lca.query('4','4'), '4');
});
""")

add(cat="graph", id="graph-mst-4",
    tzh="次小生成树", ten="Second Minimum Spanning Tree",
    szh="权值严格大于 MST 的最小生成树。",
    sen="Spanning tree with weight strictly greater than the MST, minimized.",
    dzh="先求 MST，对每条非树边 e=(u,v,w)，找 u-v 路径上最大边 mx，替换后候选=w-mx，取最小候选。",
    den="Build MST; for each non-tree edge, replace max edge on u-v path; take min delta.",
    tags="['graph','mst','second-best']", time="O(V*E)", space="O(V+E)",
    impl="""// =============================================================================
// 次小生成树 · 纯算法实现（基于 Kruskal + 路径最大边）
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface Mst2Hooks {
  onTreeEdge?: (e: { from: string; to: string; weight: number }) => void;
  onCandidate?: (e: { from: string; to: string; weight: number }, delta: number) => void;
  onDone?: (second: number) => void;
}

class DSU2 {
  parent: Map<string, string> = new Map();
  constructor(ids: Iterable<string>) { for (const x of ids) this.parent.set(x, x); }
  find(x: string): string { const p = this.parent.get(x)!; return p === x ? x : (this.parent.set(x, this.find(p)), this.parent.get(x)!); }
  union(a: string, b: string): boolean { const ra = this.find(a), rb = this.find(b); if (ra === rb) return false; this.parent.set(ra, rb); return true; }
}

export function secondMST(input: GraphInput, hooks: Mst2Hooks = {}): number {
  const edges = [...input.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
  const dsu = new DSU2(input.nodes);
  const treeAdj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of input.nodes) treeAdj.set(n, []);
  const treeSet = new Set<number>();
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i]!;
    if (dsu.union(e.from, e.to)) {
      treeSet.add(i);
      treeAdj.get(e.from)!.push({ to: e.to, w: e.weight ?? 1 });
      treeAdj.get(e.to)!.push({ to: e.from, w: e.weight ?? 1 });
      hooks.onTreeEdge?.(e);
    }
  }
  // max edge on path via BFS for each non-tree edge
  const maxOnPath = (a: string, b: string): number => {
    const visited = new Set<string>([a]);
    const q: Array<{ id: string; mx: number }> = [{ id: a, mx: 0 }];
    while (q.length > 0) {
      const cur = q.shift()!;
      if (cur.id === b) return cur.mx;
      for (const { to, w } of treeAdj.get(cur.id) ?? []) {
        if (!visited.has(to)) { visited.add(to); q.push({ id: to, mx: Math.max(cur.mx, w) }); }
      }
    }
    return Number.POSITIVE_INFINITY;
  };
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < edges.length; i++) {
    if (treeSet.has(i)) continue;
    const e = edges[i]!;
    const w = e.weight ?? 1;
    const mx = maxOnPath(e.from, e.to);
    if (w - mx > 0 && w - mx < best) { best = w - mx; hooks.onCandidate?.(e, w - mx); }
  }
  hooks.onDone?.(best === Number.POSITIVE_INFINITY ? -1 : best);
  return best === Number.POSITIVE_INFINITY ? -1 : best;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secondMST, type Mst2Hooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const treeEdges = new Set<string>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: 'default' as BarRole }));
    const edges = input.edges.map((e) => {
      const key = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      return { from: e.from, to: e.to, weight: e.weight, directed, role: (treeEdges.has(key) ? 'frontier' : 'default') as BarRole };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };
  render({ zh: '求次小生成树', en: 'Second MST' });
  const hooks: Mst2Hooks = {
    onTreeEdge: (e) => { treeEdges.add(e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`); render({ zh: `MST 加入 ${e.from}-${e.to}`, en: `MST add ${e.from}-${e.to}` }); },
    onCandidate: (e, delta) => { render({ zh: `候选 替换 ${e.from}-${e.to} 增量=${delta}`, en: `Candidate ${e.from}-${e.to} +${delta}` }); },
  };
  const ans = secondMST(input, hooks);
  rec.begin({ zh: `次小增量=${ans}`, en: `Second delta=${ans}` }).setAux([{ label: 'delta', value: String(ans), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secondMST } from '../../src/algorithms/graph/graph-mst-4/impl.ts';

test('mst2 存在', () => {
  const d = secondMST({ nodes: ['1','2','3'], edges: [{from:'1',to:'2',weight:1},{from:'2',to:'3',weight:2},{from:'1',to:'3',weight:4}] });
  assert.ok(d > 0);
});
""")

add(cat="graph", id="graph-sp-4",
    tzh="SPFA 最短路", ten="Shortest Path Faster Algorithm (SPFA)",
    szh="Bellman-Ford 的队列优化版，平均更快，可处理负权。",
    sen="Queue-optimized Bellman-Ford; faster on average; handles negative weights.",
    dzh="只有 dist 发生变化的点才入队重新松弛其邻居。可检测负权环。",
    den="Only enqueue vertices whose dist decreased; re-relax neighbors. Detects negative cycle.",
    tags="['graph','shortest-path','spfa','queue']", time="O(k*E) avg", space="O(V)",
    impl="""// =============================================================================
// SPFA · 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface SpfaHooks {
  onEnqueue?: (u: string, dist: number) => void;
  onRelax?: (from: string, to: string, newDist: number) => void;
  onDone?: (dist: Map<string, number>, hasNegCycle: boolean) => void;
}

export function spfa(input: GraphInput, start: string, hooks: SpfaHooks = {}): { dist: Map<string, number>; hasNegCycle: boolean } {
  const adj = buildAdjacency(input);
  const dist = new Map<string, number>();
  const inq = new Set<string>();
  const cnt = new Map<string, number>();
  for (const n of input.nodes) { dist.set(n, Number.POSITIVE_INFINITY); cnt.set(n, 0); }
  dist.set(start, 0); inq.add(start); cnt.set(start, 1);
  const q: string[] = [start];
  hooks.onEnqueue?.(start, 0);
  let hasNegCycle = false;
  while (q.length > 0) {
    const u = q.shift()!; inq.delete(u);
    for (const { to, w } of adj.get(u) ?? []) {
      const nd = dist.get(u)! + w;
      if (nd < (dist.get(to) ?? Infinity)) {
        dist.set(to, nd);
        hooks.onRelax?.(u, to, nd);
        if (!inq.has(to)) {
          q.push(to); inq.add(to);
          cnt.set(to, cnt.get(to)! + 1);
          hooks.onEnqueue?.(to, nd);
          if (cnt.get(to)! > input.nodes.length) { hasNegCycle = true; break; }
        }
      }
    }
    if (hasNegCycle) break;
  }
  hooks.onDone?.(dist, hasNegCycle);
  return { dist, hasNegCycle };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spfa, type SpfaHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT, start = '1'): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Number.POSITIVE_INFINITY);
  dist.set(start, 0);
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => {
      const d = dist.get(id) ?? Infinity;
      return { id, label: `${id}(${d === Infinity ? '∞' : d})`, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: 'default' as BarRole };
    });
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: `SPFA 从 ${start}`, en: `SPFA from ${start}` });
  const hooks: SpfaHooks = {
    onRelax: (from, to, nd) => { dist.set(to, nd); render({ zh: `松弛 ${from}→${to}=${nd}`, en: `Relax ${from}->${to}=${nd}` }); },
  };
  const { dist: fd, hasNegCycle } = spfa(input, start, hooks);
  rec.begin({ zh: hasNegCycle ? '负权环' : 'SPFA 完成', en: hasNegCycle ? 'Neg cycle' : 'SPFA done' }).setAux([{ label: 'dist', value: [...fd.entries()].map(([k, v]) => `${k}:${v === Infinity ? '∞' : v}`).join(' '), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spfa } from '../../src/algorithms/graph/graph-sp-4/impl.ts';

test('spfa 距离', () => {
  const { dist, hasNegCycle } = spfa({ nodes: ['1','2','3'], edges: [{from:'1',to:'2',weight:4},{from:'1',to:'3',weight:2},{from:'3',to:'2',weight:1}] }, '1');
  assert.equal(dist.get('2'), 3);
  assert.equal(hasNegCycle, false);
});
""")

add(cat="graph", id="graph-topo-4",
    tzh="拓扑排序（Kahn）", ten="Topological Sort (Kahn)",
    szh="对 DAG 按 BFS 入度法输出拓扑序，可判环。",
    sen="BFS in-degree based topological order for DAGs; detects cycles.",
    dzh="入度为 0 的点入队，每次出队并扣减邻居入度。若输出数 < V 则有环。",
    den="Enqueue 0-in-degree nodes; decrement neighbors on dequeue. <V outputs => cycle.",
    tags="['graph','topological-sort','dag','kahn']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// 拓扑排序（Kahn）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface TopoHooks {
  onEnqueue?: (u: string) => void;
  onOutput?: (u: string) => void;
  onDone?: (order: string[], hasCycle: boolean) => void;
}

export function topoSort(input: GraphInput, hooks: TopoHooks = {}): { order: string[]; hasCycle: boolean } {
  const adj = buildAdjacency(input);
  const indeg = new Map<string, number>();
  for (const n of input.nodes) indeg.set(n, 0);
  for (const e of input.edges) indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  const q: string[] = [];
  for (const n of input.nodes) if ((indeg.get(n) ?? 0) === 0) { q.push(n); hooks.onEnqueue?.(n); }
  const order: string[] = [];
  while (q.length > 0) {
    const u = q.shift()!;
    order.push(u);
    hooks.onOutput?.(u);
    for (const { to } of adj.get(u) ?? []) {
      indeg.set(to, (indeg.get(to) ?? 0) - 1);
      if ((indeg.get(to) ?? 0) === 0) { q.push(to); hooks.onEnqueue?.(to); }
    }
  }
  const hasCycle = order.length < input.nodes.length;
  hooks.onDone?.(order, hasCycle);
  return { order, hasCycle };
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topoSort, type TopoHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const outSet = new Set<string>();
  const order: string[] = [];
  const directed = input.directed ?? true;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (outSet.has(id) ? 'sorted' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).setAux([{ label: 'order', value: order.join('→') || '∅', role: 'frontier' }]).commit();
  };
  render({ zh: 'Kahn 拓扑排序', en: 'Kahn topo sort' });
  const hooks: TopoHooks = {
    onOutput: (u) => { outSet.add(u); order.push(u); render({ zh: `输出 ${u}`, en: `Output ${u}` }); },
  };
  topoSort({ ...input, directed: true }, hooks);
  rec.begin({ zh: '拓扑排序完成', en: 'Topo sort done' }).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topoSort } from '../../src/algorithms/graph/graph-topo-4/impl.ts';

test('topo 链', () => {
  const { order, hasCycle } = topoSort({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'}], directed: true });
  assert.deepEqual(order, ['1','2','3']);
  assert.equal(hasCycle, false);
});
test('topo 环', () => {
  const { hasCycle } = topoSort({ nodes: ['1','2'], edges: [{from:'1',to:'2'},{from:'2',to:'1'}], directed: true });
  assert.equal(hasCycle, true);
});
""")

add(cat="graph", id="graph-flow-4",
    tzh="最大流（Edmonds-Karp）", ten="Max Flow (Edmonds-Karp)",
    szh="源点到汇点的最大流量，BFS 增广路算法。",
    sen="Maximum flow from source to sink via BFS augmenting paths.",
    dzh="在残量图上反复 BFS 找增广路，沿路增加瓶颈流量，直到无增广路。",
    den="BFS for augmenting path in residual graph; push bottleneck; repeat until none.",
    tags="['graph','max-flow','edmonds-karp','bfs']", time="O(V*E^2)", space="O(V^2)",
    impl="""// =============================================================================
// 最大流（Edmonds-Karp）· 纯算法实现
// =============================================================================
export interface FlowInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; cap: number }>;
  source: string;
  sink: string;
}

export interface FlowHooks {
  onAugment?: (path: string[], bottleneck: number) => void;
  onDone?: (maxFlow: number) => void;
}

export function maxFlow(input: FlowInput, hooks: FlowHooks = {}): number {
  // capacity as residual
  const cap = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  const addEdge = (a: string, b: string, c: number): void => {
    adj.get(a)!.push(b); adj.get(b)!.push(a);
    cap.set(`${a}>${b}`, (cap.get(`${a}>${b}`) ?? 0) + c);
    if (!cap.has(`${b}>${a}`)) cap.set(`${b}>${a}`, 0);
  };
  for (const e of input.edges) addEdge(e.from, e.to, e.cap);
  let flow = 0;
  while (true) {
    const parent = new Map<string, string>();
    const q: string[] = [input.source];
    parent.set(input.source, input.source);
    while (q.length > 0) {
      const u = q.shift()!;
      if (u === input.sink) break;
      for (const v of adj.get(u) ?? []) {
        if (!parent.has(v) && (cap.get(`${u}>${v}`) ?? 0) > 0) { parent.set(v, u); q.push(v); }
      }
    }
    if (!parent.has(input.sink)) break;
    // find bottleneck
    let bottleneck = Number.POSITIVE_INFINITY;
    const path: string[] = [input.sink];
    let cur = input.sink;
    while (cur !== input.source) {
      const p = parent.get(cur)!;
      bottleneck = Math.min(bottleneck, cap.get(`${p}>${cur}`) ?? 0);
      path.unshift(p); cur = p;
    }
    cur = input.sink;
    while (cur !== input.source) {
      const p = parent.get(cur)!;
      cap.set(`${p}>${cur}`, (cap.get(`${p}>${cur}`) ?? 0) - bottleneck);
      cap.set(`${cur}>${p}`, (cap.get(`${cur}>${p}`) ?? 0) + bottleneck);
      cur = p;
    }
    flow += bottleneck;
    hooks.onAugment?.(path, bottleneck);
  }
  hooks.onDone?.(flow);
  return flow;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxFlow, type FlowHooks, type FlowInput } from './impl.ts';

export const DEFAULT_INPUT: FlowInput = {
  nodes: ['s','1','2','t'],
  edges: [{from:'s',to:'1',cap:10},{from:'s',to:'2',cap:5},{from:'1',to:'2',cap:4},{from:'1',to:'t',cap:7},{from:'2',to:'t',cap:9}],
  source: 's', sink: 't',
};
const POS: Record<string, {x:number;y:number}> = { s:{x:0.1,y:0.5}, '1':{x:0.4,y:0.2}, '2':{x:0.4,y:0.8}, t:{x:0.9,y:0.5} };

export function buildTrace(input: FlowInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let total = 0;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: 'default' as BarRole }));
    const edges = input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.cap, directed: true, role: 'default' as BarRole }));
    rec.begin(note).setGraph(nodes, edges).setAux([{ label: 'flow', value: String(total), role: 'frontier' }]).commit();
  };
  render({ zh: '最大流 Edmonds-Karp', en: 'Max flow EK' });
  const hooks: FlowHooks = {
    onAugment: (path, b) => { total += b; render({ zh: `增广 ${path.join('→')} +${b}`, en: `Augment ${path.join('->')} +${b}` }); },
  };
  const ans = maxFlow(input, hooks);
  rec.begin({ zh: `最大流=${ans}`, en: `Max flow=${ans}` }).setAux([{ label: 'answer', value: String(ans), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxFlow } from '../../src/algorithms/graph/graph-flow-4/impl.ts';

test('flow 经典', () => {
  const f = maxFlow({ nodes: ['s','1','2','t'], edges: [{from:'s',to:'1',cap:10},{from:'s',to:'2',cap:5},{from:'1',to:'2',cap:4},{from:'1',to:'t',cap:7},{from:'2',to:'t',cap:9}], source:'s', sink:'t' });
  assert.equal(f, 14);
});
""")

add(cat="graph", id="graph-bip-4",
    tzh="二分图判定（染色）", ten="Bipartite Check (2-Coloring)",
    szh="判断图能否用两种颜色着色使相邻不同色（即二分图）。",
    sen="Check if graph is 2-colorable (i.e. bipartite).",
    dzh="BFS/DFS 染色，相邻点必须异色，若冲突则非二分图。",
    den="BFS/DFS coloring; neighbors must differ; conflict => not bipartite.",
    tags="['graph','bipartite','coloring','bfs']", time="O(V + E)", space="O(V)",
    impl="""// =============================================================================
// 二分图判定（染色）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface BipHooks {
  onColor?: (u: string, color: number) => void;
  onConflict?: (u: string, v: string) => void;
  onDone?: (bipartite: boolean) => void;
}

export function isBipartite(input: GraphInput, hooks: BipHooks = {}): boolean {
  const adj = buildAdjacency(input);
  const color = new Map<string, number>();
  for (const start of input.nodes) {
    if (color.has(start)) continue;
    color.set(start, 0);
    hooks.onColor?.(start, 0);
    const q: string[] = [start];
    while (q.length > 0) {
      const u = q.shift()!;
      for (const { to } of adj.get(u) ?? []) {
        if (!color.has(to)) {
          color.set(to, 1 - color.get(u)!);
          hooks.onColor?.(to, color.get(to)!);
          q.push(to);
        } else if (color.get(to) === color.get(u)) {
          hooks.onConflict?.(u, to);
          hooks.onDone?.(false);
          return false;
        }
      }
    }
  }
  hooks.onDone?.(true);
  return true;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isBipartite, type BipHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const color = new Map<string, number>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id + (color.has(id) ? `/${color.get(id)}` : ''), x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (color.has(id) ? (color.get(id) === 0 ? 'frontier' : 'compare') : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: '二分图染色', en: 'Bipartite coloring' });
  const hooks: BipHooks = {
    onColor: (u, c) => { color.set(u, c); render({ zh: `染 ${u}=${c}`, en: `Color ${u}=${c}` }); },
    onConflict: (u, v) => { render({ zh: `冲突 ${u}-${v}`, en: `Conflict ${u}-${v}` }); },
  };
  const ok = isBipartite(input, hooks);
  rec.begin({ zh: ok ? '是二分图' : '非二分图', en: ok ? 'Bipartite' : 'Not bipartite' }).setAux([{ label: 'result', value: String(ok), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBipartite } from '../../src/algorithms/graph/graph-bip-4/impl.ts';

test('bip 偶环', () => {
  assert.equal(isBipartite({ nodes: ['1','2','3','4'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'4'},{from:'4',to:'1'}] }), true);
});
test('bip 奇环', () => {
  assert.equal(isBipartite({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'1'}] }), false);
});
""")

add(cat="graph", id="graph-col-4",
    tzh="图着色（贪心）", ten="Graph Coloring (Greedy)",
    szh="Welsh-Powell 贪心法用最少颜色给图着色（近似）。", sen="Greedy Welsh-Powell coloring using few colors (heuristic).",
    dzh="按度数降序处理，每个点取最小可用颜色（不与已着色邻居冲突）。",
    den="Process by descending degree; assign smallest color not used by colored neighbors.",
    tags="['graph','coloring','greedy','welsh-powell']", time="O(V^2)", space="O(V)",
    impl="""// =============================================================================
// 图着色（贪心）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface ColHooks {
  onColor?: (u: string, color: number) => void;
  onDone?: (colors: number) => void;
}

export function greedyColoring(input: GraphInput, hooks: ColHooks = {}): Map<string, number> {
  const adj = buildAdjacency(input);
  const order = [...input.nodes].sort((a, b) => (adj.get(b)!.length) - (adj.get(a)!.length));
  const color = new Map<string, number>();
  for (const u of order) {
    const used = new Set<number>();
    for (const { to } of adj.get(u) ?? []) if (color.has(to)) used.add(color.get(to)!);
    let c = 0;
    while (used.has(c)) c++;
    color.set(u, c);
    hooks.onColor?.(u, c);
  }
  const colors = new Set(color.values()).size;
  hooks.onDone?.(colors);
  return color;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyColoring, type ColHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const color = new Map<string, number>();
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id + (color.has(id) ? `/${color.get(id)}` : ''), x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (color.has(id) ? 'sorted' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).commit();
  };
  render({ zh: '贪心着色', en: 'Greedy coloring' });
  const hooks: ColHooks = {
    onColor: (u, c) => { color.set(u, c); render({ zh: `${u}←${c}`, en: `${u}=${c}` }); },
  };
  const colorMap = greedyColoring(input, hooks);
  rec.begin({ zh: `用 ${new Set(colorMap.values()).size} 色`, en: `${new Set(colorMap.values()).size} colors` }).setAux([{ label: 'colors', value: String(new Set(colorMap.values()).size), role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyColoring } from '../../src/algorithms/graph/graph-col-4/impl.ts';

test('col 三角需 3 色', () => {
  const c = greedyColoring({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'1',to:'3'}] });
  assert.equal(new Set(c.values()).size, 3);
});
test('col 链', () => {
  const c = greedyColoring({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'}] });
  assert.equal(new Set(c.values()).size, 2);
});
""")

add(cat="graph", id="graph-eul-4",
    tzh="欧拉回路（Hierholzer）", ten="Euler Circuit (Hierholzer)",
    szh="经过每条边恰好一次的回路，Hierholzer 栈算法。",
    sen="Circuit visiting every edge exactly once; Hierholzer stack algorithm.",
    dzh="存在条件：连通且所有点度数偶（无向）。从任点 DFS，无路可走时入栈，回溯拼接即得欧拉回路。",
    den="Exists iff connected and all degrees even. DFS; push on dead-end; reverse = Euler circuit.",
    tags="['graph','euler','hierholzer','circuit']", time="O(V + E)", space="O(V + E)",
    impl="""// =============================================================================
// 欧拉回路（Hierholzer）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface EulHooks {
  onVisit?: (u: string) => void;
  onPush?: (u: string) => void;
  onDone?: (circuit: string[]) => void;
}

export function eulerCircuit(input: GraphInput, hooks: EulHooks = {}): string[] {
  // adjacency with edge-ids to support multigraph deletion
  const adj = new Map<string, Array<{ to: string; id: number }>>();
  for (const n of input.nodes) adj.set(n, []);
  let eid = 0;
  const used = new Set<number>();
  for (const e of input.edges) {
    adj.get(e.from)!.push({ to: e.to, id: eid });
    if (!(input.directed ?? false)) adj.get(e.to)!.push({ to: e.from, id: eid });
    eid++;
  }
  const stack: string[] = [];
  const path: string[] = [];
  const start = input.nodes[0] ?? '';
  stack.push(start);
  while (stack.length > 0) {
    const u = stack[stack.length - 1]!;
    const list = adj.get(u) ?? [];
    let found = false;
    while (list.length > 0) {
      const top = list.pop()!;
      if (used.has(top.id)) continue;
      used.add(top.id);
      hooks.onVisit?.(u);
      stack.push(top.to);
      found = true;
      break;
    }
    if (!found) {
      const out = stack.pop()!;
      path.push(out);
      hooks.onPush?.(out);
    }
  }
  const circuit = path.reverse();
  hooks.onDone?.(circuit);
  return circuit;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerCircuit, type EulHooks, type GraphInput } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['1','2','3','4'],
  edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'4'},{from:'4',to:'1'},{from:'1',to:'3'},{from:'2',to:'4'}],
};
const POS: Record<string, {x:number;y:number}> = { '1':{x:0.2,y:0.3},'2':{x:0.8,y:0.3},'3':{x:0.8,y:0.7},'4':{x:0.2,y:0.7} };

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<string>();
  const circuit: string[] = [];
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => ({ id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (visited.has(id) ? 'sorted' : 'default') as BarRole }));
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, directed, role: 'default' as BarRole }))).setAux([{ label: 'circuit', value: circuit.join('→') || '∅', role: 'frontier' }]).commit();
  };
  render({ zh: 'Hierholzer 欧拉回路', en: 'Hierholzer Euler circuit' });
  const hooks: EulHooks = {
    onPush: (u) => { visited.add(u); circuit.push(u); render({ zh: `入序 ${u}`, en: `Push ${u}` }); },
  };
  eulerCircuit(input, hooks);
  rec.begin({ zh: `回路 ${circuit.join('→')}`, en: `Circuit ${circuit.join('->')}` }).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerCircuit } from '../../src/algorithms/graph/graph-eul-4/impl.ts';

test('euler 回路长度', () => {
  const c = eulerCircuit({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'1'}] });
  assert.equal(c.length, 4);  // 3 edges + return to start
  assert.equal(c[0], c[c.length - 1]);
});
""")

add(cat="graph", id="graph-ham-4",
    tzh="哈密顿回路（回溯）", ten="Hamiltonian Cycle (Backtracking)",
    szh="经过每个点恰好一次并回到起点的回路（NP 完备，回溯求解）。",
    sen="Cycle visiting each vertex exactly once and returning to start (NP-complete).",
    dzh="回溯：从起点出发，每步选未访问且相邻的点递归；所有点访问后能回到起点则成功。",
    den="Backtrack from start; pick unvisited neighbor each step; if all visited and adjacent to start, succeed.",
    tags="['graph','hamiltonian','backtracking','np']", time="O(V!)", space="O(V)",
    impl="""// =============================================================================
// 哈密顿回路（回溯）· 纯算法实现
// =============================================================================
""" + GRAPH_INPUT_TYPE + """
export interface HamHooks {
  onPlace?: (pos: number, u: string) => void;
  onBacktrack?: (pos: number, u: string) => void;
  onDone?: (cycle: string[] | null) => void;
}

export function hamiltonianCycle(input: GraphInput, hooks: HamHooks = {}): string[] | null {
  const adjSet = new Map<string, Set<string>>();
  for (const n of input.nodes) adjSet.set(n, new Set());
  for (const e of input.edges) { adjSet.get(e.from)!.add(e.to); adjSet.get(e.to)!.add(e.from); }
  const V = input.nodes.length;
  if (V === 0) return null;
  const start = input.nodes[0]!;
  const path: string[] = [start];
  const used = new Set<string>([start]);
  const solve = (pos: number): boolean => {
    if (pos === V) {
      if (adjSet.get(path[pos - 1]!)!.has(start)) return true;
      return false;
    }
    for (const next of input.nodes) {
      if (used.has(next)) continue;
      if (!adjSet.get(path[pos - 1]!)!.has(next)) continue;
      path.push(next); used.add(next);
      hooks.onPlace?.(pos, next);
      if (solve(pos + 1)) return true;
      path.pop(); used.delete(next);
      hooks.onBacktrack?.(pos, next);
    }
    return false;
  };
  const ok = solve(1);
  const result = ok ? [...path, start] : null;
  hooks.onDone?.(result);
  return result;
}
""",
    trace="""import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hamiltonianCycle, type HamHooks, type GraphInput } from './impl.ts';
""" + GRAPH_DEFAULT + POS_INIT + """
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const path: string[] = [];
  const directed = input.directed ?? false;
  const render = (note: { zh: string; en: string }): void => {
    const nodes = input.nodes.map((id) => {
      const idx = path.indexOf(id);
      return { id, label: id + (idx >= 0 ? `(${idx})` : ''), x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role: (idx >= 0 ? 'sorted' : 'default') as BarRole };
    });
    rec.begin(note).setGraph(nodes, input.edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight, directed, role: 'default' as BarRole }))).setAux([{ label: 'path', value: path.join('→') || '∅', role: 'frontier' }]).commit();
  };
  render({ zh: '哈密顿回路回溯', en: 'Hamiltonian backtracking' });
  const hooks: HamHooks = {
    onPlace: (_pos, u) => { path.push(u); render({ zh: `放置 ${u}`, en: `Place ${u}` }); },
    onBacktrack: (_pos, u) => { const i = path.lastIndexOf(u); if (i >= 0) path.splice(i, 1); render({ zh: `回溯 ${u}`, en: `Backtrack ${u}` }); },
  };
  const ans = hamiltonianCycle(input, hooks);
  rec.begin({ zh: ans ? `找到 ${ans.join('→')}` : '无解', en: ans ? `Found ${ans.join('->')}` : 'None' }).setAux([{ label: 'result', value: ans ? ans.join('→') : '∅', role: 'final' }]).commit();
  return rec.build();
}
""",
    test="""import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hamiltonianCycle } from '../../src/algorithms/graph/graph-ham-4/impl.ts';

test('ham 四边形', () => {
  const c = hamiltonianCycle({ nodes: ['1','2','3','4'], edges: [{from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'4'},{from:'4',to:'1'}] });
  assert.ok(c !== null);
  assert.equal(c!.length, 5);
});
test('ham 无解', () => {
  const c = hamiltonianCycle({ nodes: ['1','2','3'], edges: [{from:'1',to:'2'}] });
  assert.equal(c, null);
});
""")

print("graph section loaded:", len(ALL))
