// =============================================================================
// 多重背包（Multiple Knapsack）· 二进制拆分优化 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 每件物品有有限数量 count[i]；用二进制拆分把「选 0..count 件」拆成 O(log count) 个 0/1 物品，
// 转化为 0/1 背包。
// =============================================================================

/** 一个物品：重量、价值、最大数量。 */
export interface KnapsackItem {
  weight: number;
  value: number;
  count: number;
}

/** 拆分后的 0/1 物品（来源物品索引、本块件数、总重量、总价值）。 */
export interface SplitItem {
  /** 来源物品索引（0-based）。 */
  src: number;
  /** 本块代表的件数。 */
  amount: number;
  /** 本块总重量。 */
  weight: number;
  /** 本块总价值。 */
  value: number;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface KnapsackMultipleHooks {
  /** 把物品 i 拆分成若干块 splitItems。 */
  onSplit?: (i: number, splitItems: SplitItem[]) => void;
  /** 处理一块（0/1 物品）blockIdx，在容量 w 处：val 为更新后值，take 是否取该块。 */
  onProcessBlock?: (blockIdx: number, w: number, val: number, take: boolean) => void;
  /** 算法完成：最大价值。 */
  onDone?: (value: number) => void;
}

/** 把数量 c 拆成二进制块：1,2,4,…,余数。 */
export function binarySplit(c: number): number[] {
  const parts: number[] = [];
  let k = 1;
  let rest = c;
  while (k <= rest) {
    parts.push(k);
    rest -= k;
    k <<= 1;
  }
  if (rest > 0) parts.push(rest);
  return parts;
}

/**
 * 多重背包（二进制拆分优化）：每件物品有有限数量，求容量限制下最大价值。
 *
 * 思路：对每件物品，把「选 0..count 件」按二进制拆成 `1,2,4,…,余数` 若干块；
 * 任意 0..count 都能由若干块拼出，于是转化为 0/1 背包（每块「取或不取」）。
 * 物品总数从 `Σ count` 降到 `Σ log(count)`，复杂度 `O(capacity · Σ log count)`。
 *
 * @param items 物品列表（weight>0, value>=0, count>=0）
 * @param capacity 背包容量
 * @param hooks 可选事件钩子
 * @returns 最大价值
 */
export function knapsackMultiple(
  items: readonly KnapsackItem[],
  capacity: number,
  hooks: KnapsackMultipleHooks = {},
): number {
  const n = items.length;
  if (n === 0 || capacity <= 0) {
    hooks.onDone?.(0);
    return 0;
  }

  // 二进制拆分
  const blocks: SplitItem[] = [];
  for (let i = 0; i < n; i++) {
    const { weight, value, count } = items[i]!;
    const parts = binarySplit(count);
    const splitForI: SplitItem[] = parts.map((amount) => ({
      src: i,
      amount,
      weight: weight * amount,
      value: value * amount,
    }));
    blocks.push(...splitForI);
    hooks.onSplit?.(i, splitForI);
  }

  // 0/1 背包：一维滚动，内层逆序
  const dp = new Array<number>(capacity + 1).fill(0);
  for (let b = 0; b < blocks.length; b++) {
    const blk = blocks[b]!;
    for (let w = capacity; w >= blk.weight; w--) {
      const take = dp[w - blk.weight]! + blk.value;
      if (take > dp[w]!) {
        dp[w] = take;
        hooks.onProcessBlock?.(b, w, take, true);
      } else {
        hooks.onProcessBlock?.(b, w, dp[w]!, false);
      }
    }
  }

  const value = dp[capacity]!;
  hooks.onDone?.(value);
  return value;
}
