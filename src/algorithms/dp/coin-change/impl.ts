// =============================================================================
// 零钱兑换 Coin Change · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 给定面额 coins 与金额 amount，求凑出 amount 所需的最少硬币数。
//   完全背包视角：每枚硬币可重复使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CoinChangeHooks {
  /** 金额 i 处，尝试用硬币 coin 转移（来自 i-coin）。better 表示是否更优。 */
  onTryCoin?: (i: number, coin: number, prev: number, candidate: number, better: boolean) => void;
  /** 金额 i 处的 dp 值确定。Infinity 表示不可凑出。 */
  onSetValue?: (i: number, value: number) => void;
  /** 回溯：凑出 amount 时使用的硬币 coin（来自金额 from）。 */
  onPickCoin?: (coin: number, from: number) => void;
}

/** 结果：最少硬币数与一个具体方案（硬币面额数组）。不可凑出时 coins 为 null。 */
export interface CoinChangeResult {
  count: number; // -1 表示不可凑出
  coins: number[] | null;
}

/** 哨兵：表示不可达。 */
export const UNREACHABLE = -1;

/**
 * 零钱兑换（最少硬币数）。
 *
 * 状态：`dp[i]` = 凑出金额 `i` 所需的最少硬币数；不可凑出记 `Infinity`。
 *   - `dp[0] = 0`
 *   - `dp[i] = min_{coin <= i} ( dp[i-coin] + 1 )`
 *
 * @param coins 面额数组（可含重复；内部去重并升序）
 * @param amount 目标金额
 * @returns { count, coins }；count = -1 表示不可凑出
 */
export function coinChange(
  coins: readonly number[],
  amount: number,
  hooks: CoinChangeHooks = {},
): CoinChangeResult {
  if (amount < 0) return { count: -1, coins: null };
  if (amount === 0) return { count: 0, coins: [] };

  // 去重 + 升序 + 过滤非正
  const denoms = Array.from(new Set(coins))
    .filter((c) => c > 0)
    .sort((a, b) => a - b);
  if (denoms.length === 0) return { count: -1, coins: null };

  const INF = Infinity;
  const dp: number[] = new Array<number>(amount + 1).fill(INF);
  const choice: number[] = new Array<number>(amount + 1).fill(-1); // 记录每个金额最优时用的硬币
  dp[0] = 0;
  hooks.onSetValue?.(0, 0);

  for (let i = 1; i <= amount; i++) {
    for (const coin of denoms) {
      if (coin > i) break; // 升序，后续更大必超
      const prev = dp[i - coin]!;
      if (prev === INF) {
        hooks.onTryCoin?.(i, coin, prev, INF, false);
        continue;
      }
      const candidate = prev + 1;
      const better = candidate < dp[i]!;
      if (better) {
        dp[i] = candidate;
        choice[i] = coin;
      }
      hooks.onTryCoin?.(i, coin, prev, candidate, better);
    }
    hooks.onSetValue?.(i, dp[i]!);
  }

  if (dp[amount] === INF) return { count: -1, coins: null };

  // 回溯还原一个方案
  const picked: number[] = [];
  let cur = amount;
  while (cur > 0) {
    const coin = choice[cur]!;
    picked.push(coin);
    hooks.onPickCoin?.(coin, cur - coin);
    cur -= coin;
  }

  return { count: dp[amount]!, coins: picked };
}
