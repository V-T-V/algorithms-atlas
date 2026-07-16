// =============================================================================
// 优化梳排序（Optimized Comb Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CombSortOptHooks {
  /** 进入新的一轮，gap 为当前间隔，phase 为 'comb' 或 'bubble'。 */
  onGap?: (gap: number, phase: 'comb' | 'bubble') => void;
  /** 比较相距 gap 的下标 i、j。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 本轮结束，是否发生了交换。 */
  onPassEnd?: (swapped: boolean) => void;
}

const SHRINK = 1.3;

/**
 * 优化梳排序：与标准版相比，gap 收缩后强制把 9/10 修正为 11（避免鬼影间隔），
 * 且 gap=1 时启用冒泡短路（一次无交换即停）。
 *
 * 时间平均约 `O(n² / 2^p)`，最坏 `O(n²)`；空间 `O(1)`；原地、**不稳定**。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function combSortOptimized(arr: readonly number[], hooks: CombSortOptHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let swapped = true;

  while (gap > 1 || swapped) {
    if (gap > 1) {
      gap = Math.floor(gap / SHRINK);
      // 鬼影间隔修正：9 和 10 都改为 11，这是梳排序经验上的关键优化。
      if (gap === 9 || gap === 10) gap = 11;
      if (gap < 1) gap = 1;
    }
    const phase: 'comb' | 'bubble' = gap === 1 ? 'bubble' : 'comb';
    hooks.onGap?.(gap, phase);
    swapped = false;
    for (let i = 0; i + gap < n; i++) {
      hooks.onCompare?.(i, i + gap);
      if (a[i]! > a[i + gap]!) {
        const t = a[i]!;
        a[i] = a[i + gap]!;
        a[i + gap] = t;
        swapped = true;
        hooks.onSwap?.(i, i + gap);
      }
    }
    hooks.onPassEnd?.(swapped);
  }
  return a;
}
