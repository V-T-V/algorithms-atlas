// =============================================================================
// H 指数（H-Index）· 纯算法实现
// H 指数：最大的 h，使作者至少有 h 篇论文的引用数 >= h。
// 用计数排序思想 O(n) 求解。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HIndexHooks {
  /** 构造计数桶后，桶 idx 的累计值。 */
  onCount?: (idx: number, cum: number) => void;
  /** 从右向左扫描，发现 h。 */
  onScan?: (idx: number, cum: number, isH: boolean) => void;
  /** 计算完成。 */
  onDone?: (h: number) => void;
}

/**
 * 计算 H 指数。
 * @param citations 每篇论文的引用数
 * @returns H 指数
 */
export function hIndex(citations: readonly number[], hooks: HIndexHooks = {}): number {
  const n = citations.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  // count[i] = 引用数恰好为 i 的论文数（i>n 的归入 count[n]）
  const count = new Array<number>(n + 1).fill(0);
  for (const c of citations) {
    const idx = Math.min(c, n);
    count[idx] = count[idx]! + 1;
  }
  // 从高到低累计，找首个 cum >= i 的 i
  let total = 0;
  for (let i = n; i >= 0; i--) {
    total += count[i]!;
    hooks.onCount?.(i, total);
    if (total >= i) {
      hooks.onScan?.(i, total, true);
      hooks.onDone?.(i);
      return i;
    }
    hooks.onScan?.(i, total, false);
  }
  hooks.onDone?.(0);
  return 0;
}
