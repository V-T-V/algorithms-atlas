// =============================================================================
// 鸡尾酒排序 Cocktail Shaker Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CocktailSortHooks {
  /** 开始一轮正向扫描（向右），未排序段为 [lo, hi]。 */
  onForwardStart?: (lo: number, hi: number) => void;
  /** 开始一轮反向扫描（向左），未排序段为 [lo, hi]。 */
  onBackwardStart?: (lo: number, hi: number) => void;
  /** 比较相邻下标 i、j。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 下标 i 已就位。 */
  onSorted?: (i: number) => void;
}

/**
 * 鸡尾酒排序 / 双向冒泡（原地、稳定）。
 * 冒泡排序的变体：每轮先向右把最大值冒泡到 hi，再向左把最小值冒泡到 lo，
 * 然后 hi--、lo++ 收缩未排序段。能更快处理「两端各有极值」的数组。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function cocktailSort(arr: readonly number[], hooks: CocktailSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const sorted = new Set<number>();
  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  let lo = 0;
  let hi = n - 1;
  let swapped = true;

  while (lo < hi && swapped) {
    swapped = false;

    // 正向：最大值冒泡到 hi
    hooks.onForwardStart?.(lo, hi);
    for (let i = lo; i < hi; i++) {
      hooks.onCompare?.(i, i + 1);
      if (a[i]! > a[i + 1]!) {
        swap(i, i + 1);
        hooks.onSwap?.(i, i + 1);
        swapped = true;
      }
    }
    sorted.add(hi);
    hooks.onSorted?.(hi);
    hi--;
    if (!swapped) break;

    // 反向：最小值冒泡到 lo
    swapped = false;
    hooks.onBackwardStart?.(lo, hi);
    for (let i = hi; i > lo; i--) {
      hooks.onCompare?.(i - 1, i);
      if (a[i - 1]! > a[i]!) {
        swap(i - 1, i);
        hooks.onSwap?.(i - 1, i);
        swapped = true;
      }
    }
    sorted.add(lo);
    hooks.onSorted?.(lo);
    lo++;
  }

  // 兜底：未排序段内剩余元素也已就位
  for (let k = lo; k <= hi; k++) {
    if (!sorted.has(k)) {
      sorted.add(k);
      hooks.onSorted?.(k);
    }
  }
  return a;
}
