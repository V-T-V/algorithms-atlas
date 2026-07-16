// =============================================================================
// 梳排序 Comb Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CombSortHooks {
  /** 进入新的一轮，gap 为当前间隔。 */
  onGap?: (gap: number) => void;
  /** 比较相距 gap 的下标 i、i+gap。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
}

const SHRINK = 1.3; // 经验收缩因子

/**
 * 梳排序（Comb Sort）。
 *
 * 原理：冒泡排序的改进版。用一个不断收缩的**间隔 gap** 进行远距离比较-交换，
 * 快速消除「乌龟」（数组末端的小值）；gap 每轮按因子 `1.3` 缩小，直到 `gap = 1`
 * 时退化为普通冒泡（再扫一遍确保完全有序）。
 *
 * - 平均时间 `O(n² / 2^p)`，p 为 gap 增量数；最坏 `O(n²)`
 * - 空间 `O(1)`，原地、**不稳定**
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function combSort(arr: readonly number[], hooks: CombSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = Math.floor(gap / SHRINK);
    if (gap < 1) gap = 1;
    hooks.onGap?.(gap);
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
  }
  return a;
}
