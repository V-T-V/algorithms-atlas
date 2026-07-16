// =============================================================================
// 冒泡排序 Bubble Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BubbleSortHooks {
  /** 开始新的一轮扫描（pass = 第几轮，0-based）。 */
  onPassStart?: (pass: number, hi: number) => void;
  /** 比较相邻下标 i、i+1。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 下标 i 已就位（本轮最大值冒泡到末尾）。 */
  onSorted?: (i: number) => void;
}

/**
 * 冒泡排序（原地、稳定）。
 * 重复扫描数组，每轮把当前最大值「冒泡」到未排序段末尾；
 * 若某轮未发生任何交换，说明已有序，提前结束。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function bubbleSort(arr: readonly number[], hooks: BubbleSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const sorted = new Set<number>();

  for (let pass = 0; pass < n - 1; pass++) {
    const hi = n - 1 - pass; // 本轮未排序段的右端
    let swapped = false;
    hooks.onPassStart?.(pass, hi);
    for (let i = 0; i < hi; i++) {
      hooks.onCompare?.(i, i + 1);
      if (a[i]! > a[i + 1]!) {
        const t = a[i]!;
        a[i] = a[i + 1]!;
        a[i + 1] = t;
        swapped = true;
        hooks.onSwap?.(i, i + 1);
      }
    }
    sorted.add(hi);
    hooks.onSorted?.(hi);
    if (!swapped) {
      // 提前结束：剩余未标记的元素也已就位
      for (let k = 0; k < hi; k++) {
        if (!sorted.has(k)) {
          sorted.add(k);
          hooks.onSorted?.(k);
        }
      }
      break;
    }
  }
  if (n >= 1 && !sorted.has(0)) {
    sorted.add(0);
    hooks.onSorted?.(0);
  }
  return a;
}
