// =============================================================================
// 煎饼排序 Pancake Sort · 纯算法实现
// 翻转前缀。零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PancakeSortHooks {
  /** 在未排序段 [0, hi] 中找到最大值，位于下标 maxIdx。 */
  onFindMax?: (hi: number, maxIdx: number) => void;
  /** 翻转前缀 [0, k]（即把 0..k 反转）。 */
  onFlip?: (k: number) => void;
  /** 下标 i 已就位（最终位置）。 */
  onPinned?: (i: number) => void;
}

/** 翻转数组 a 的前缀 [0, k]（含）。 */
function flip(a: number[], k: number): void {
  let l = 0;
  let r = k;
  while (l < r) {
    const t = a[l]!;
    a[l] = a[r]!;
    a[r] = t;
    l++;
    r--;
  }
}

/**
 * 煎饼排序：每轮把未排序段的最大值翻到顶部，再翻转一次送到末尾就位。
 * 只用「翻转前缀」这一种操作。原地、不稳定。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function pancakeSort(arr: readonly number[], hooks: PancakeSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  for (let hi = n - 1; hi > 0; hi--) {
    // 在未排序段 [0, hi] 找最大值下标
    let maxIdx = 0;
    for (let i = 1; i <= hi; i++) {
      if (a[i]! > a[maxIdx]!) maxIdx = i;
    }
    hooks.onFindMax?.(hi, maxIdx);

    if (maxIdx === hi) {
      // 已在末尾，无需翻转
      hooks.onPinned?.(hi);
      continue;
    }
    // 第 1 次翻转：把最大值翻到顶部（下标 0）
    if (maxIdx !== 0) {
      flip(a, maxIdx);
      hooks.onFlip?.(maxIdx);
    }
    // 第 2 次翻转：把顶部（最大值）翻到末尾就位
    flip(a, hi);
    hooks.onFlip?.(hi);
    hooks.onPinned?.(hi);
  }
  return a;
}
