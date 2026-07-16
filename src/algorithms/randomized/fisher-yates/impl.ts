// =============================================================================
// Fisher-Yates 洗牌（Fisher-Yates / Knuth Shuffle）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 产生 [0, n) 区间整数的确定性伪随机函数类型。 */
export type Rng = (n: number) => number;

/**
 * 线性同余生成器（LCG），可复现的随机源。
 * 同一种子产生同一序列，便于 buildTrace 与单测断言。
 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (n: number): number => {
    // 常量取 Numerical Recipes 版本
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % n;
  };
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FisherYatesHooks {
  /** 选中处理下标 i，并从 [0, i] 中随机抽取到下标 j。 */
  onPick?: (i: number, j: number) => void;
  /** 交换下标 i、j（含 i===j 的自交换）。 */
  onSwap?: (i: number, j: number) => void;
}

/**
 * Fisher-Yates 原地洗牌（Durstenfeld 版本，从后向前）。
 * 等概率地产生所有 n! 种排列，是无偏洗牌。
 *
 * @param arr 待洗牌数组（克隆后操作，不修改原数组）
 * @param rng 随机源；默认用 Math.random（不可复现）
 * @param hooks 可选事件钩子
 * @returns 洗牌后的新数组
 */
export function fisherYates(
  arr: readonly number[],
  rng: Rng = (n) => Math.floor(Math.random() * n),
  hooks: FisherYatesHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = n - 1; i > 0; i--) {
    const j = rng(i + 1); // [0, i]
    hooks.onPick?.(i, j);
    if (i !== j) {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
    }
    hooks.onSwap?.(i, j);
  }
  return a;
}
