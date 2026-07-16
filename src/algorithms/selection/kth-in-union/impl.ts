// 两个有序数组并集第 k 小 · 纯算法实现

const INF = Number.POSITIVE_INFINITY;

/** 事件钩子。 */
export interface KthInUnionHooks {
  /** 本轮在 a、b 中比较两个候选（用下标表示，-1 表示越界）。 */
  onCompare?: (k: number, aIdx: number, bIdx: number, aVal: number, bVal: number) => void;
  /** 排除某数组 [lo..hi] 段。 */
  onDiscard?: (which: 'a' | 'b', lo: number, hi: number) => void;
  /** 命中第 k 小（值与来源）。 */
  onResult?: (value: number, which: 'a' | 'b', idx: number) => void;
}

/**
 * 两个升序数组 a、b 的并集中第 k 小（1-based）。
 * @param a 升序数组
 * @param b 升序数组
 * @param k 1-based 排名
 * @param hooks 可选事件钩子
 */
export function kthInUnion(
  a: readonly number[],
  b: readonly number[],
  k: number,
  hooks: KthInUnionHooks = {},
): number {
  const total = a.length + b.length;
  if (k < 1 || k > total) throw new RangeError(`k out of range: ${k}`);

  // 安全取值，越界返回 +∞
  const get = (arr: readonly number[], i: number): number =>
    i >= 0 && i < arr.length ? arr[i]! : INF;

  const solve = (ai: number, bi: number, kk: number): number => {
    if (kk === 1) {
      const av = get(a, ai);
      const bv = get(b, bi);
      hooks.onCompare?.(kk, ai, bi, av, bv);
      if (av <= bv) {
        hooks.onResult?.(av, 'a', ai);
        return av;
      }
      hooks.onResult?.(bv, 'b', bi);
      return bv;
    }
    // 半步：kk 的一半，但不超过剩余可用
    const half = Math.floor(kk / 2);
    const aIdx = ai + half - 1;
    const bIdx = bi + half - 1;
    const av = get(a, aIdx);
    const bv = get(b, bIdx);
    hooks.onCompare?.(kk, aIdx, bIdx, av, bv);
    if (av <= bv) {
      // 排除 a[ai..aIdx]
      hooks.onDiscard?.('a', ai, aIdx);
      return solve(aIdx + 1, bi, kk - (aIdx - ai + 1));
    }
    hooks.onDiscard?.('b', bi, bIdx);
    return solve(ai, bIdx + 1, kk - (bIdx - bi + 1));
  };

  return solve(0, 0, k);
}
