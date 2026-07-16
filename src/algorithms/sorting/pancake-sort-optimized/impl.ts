// =============================================================================
// 优化煎饼排序（Optimized Pancake Sort）· 纯算法实现
// 翻转前缀。零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PancakeOptHooks {
  /** 在未排序段 [0, hi] 中找到最大值，位于下标 maxIdx。 */
  onFindMax?: (hi: number, maxIdx: number) => void;
  /** 翻转前缀 [0, k]。 */
  onFlip?: (k: number) => void;
  /** 因最大值已就位而跳过翻转。 */
  onSkip?: (hi: number) => void;
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
 * 优化煎饼排序：每轮把未排序段最大值「翻到顶」再「翻到尾」就位，含两个短路优化。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 * @returns [排序后数组, 翻转次数]
 */
export function pancakeSortOptimized(
  arr: readonly number[],
  hooks: PancakeOptHooks = {},
): [number[], number] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return [a, 0];

  let flips = 0;

  for (let hi = n - 1; hi > 0; hi--) {
    let maxIdx = 0;
    for (let i = 1; i <= hi; i++) {
      if (a[i]! > a[maxIdx]!) maxIdx = i;
    }
    hooks.onFindMax?.(hi, maxIdx);

    if (maxIdx === hi) {
      hooks.onSkip?.(hi);
      hooks.onPinned?.(hi);
      continue;
    }
    if (maxIdx !== 0) {
      flip(a, maxIdx);
      flips++;
      hooks.onFlip?.(maxIdx);
    }
    flip(a, hi);
    flips++;
    hooks.onFlip?.(hi);
    hooks.onPinned?.(hi);
  }
  return [a, flips];
}
