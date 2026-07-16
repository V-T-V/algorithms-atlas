// =============================================================================
// 优化冒泡排序（Optimized Bubble Sort）· 纯算法实现
// 提前终止 + 记录最后交换位置。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface OptimizedBubbleHooks {
  /** 开始新的一轮，本轮上界（不含）为 end。 */
  onPassStart?: (pass: number, end: number) => void;
  /** 比较相邻下标 i、i+1。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 记录本轮最后交换位置 lastSwap（用于收紧下一轮上界）。 */
  onLastSwap?: (lastSwap: number) => void;
  /** 本轮无交换，提前终止。 */
  onEarlyExit?: () => void;
  /** 下标 i 已就位（上界 end-1）。 */
  onSorted?: (i: number) => void;
}

/**
 * 优化冒泡排序（原地、稳定）。
 * 每轮扫描 [0, end)，记录最后交换位置 lastSwap；
 * 下一轮 end 收紧为 lastSwap；若 lastSwap 为 0（无交换）则提前结束。
 * 时间：最好 O(n)，最坏/平均 O(n²)；空间 O(1)。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function optimizedBubbleSort(
  arr: readonly number[],
  hooks: OptimizedBubbleHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  let end = n; // 本轮扫描上界（不含）
  let pass = 0;

  while (end > 1) {
    let lastSwap = 0;
    hooks.onPassStart?.(pass, end);
    for (let i = 0; i < end - 1; i++) {
      hooks.onCompare?.(i, i + 1);
      if (a[i]! > a[i + 1]!) {
        const t = a[i]!;
        a[i] = a[i + 1]!;
        a[i + 1] = t;
        lastSwap = i + 1;
        hooks.onSwap?.(i, i + 1);
      }
    }
    if (lastSwap === 0) {
      // 本轮无交换，[0, end) 已全部有序
      for (let k = 0; k < end; k++) hooks.onSorted?.(k);
      hooks.onEarlyExit?.();
      break;
    }
    // 标记本轮冒泡到顶的元素 [lastSwap, end) 已就位
    for (let k = lastSwap; k < end; k++) hooks.onSorted?.(k);
    hooks.onLastSwap?.(lastSwap);
    end = lastSwap;
    pass++;
  }
  if (n >= 1) hooks.onSorted?.(0);
  return a;
}
