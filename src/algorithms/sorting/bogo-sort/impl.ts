// =============================================================================
// 猴子排序 Bogo Sort (Stupid Sort) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BogoSortHooks {
  /** 完成一次随机洗牌（attempts 为当前尝试次数）。 */
  onShuffle?: (attempts: number) => void;
  /** 检查有序性，isSorted 表示本次是否已有序。 */
  onCheck?: (isSorted: boolean) => void;
}

/**
 * 猴子排序（Bogo Sort / 愚蠢排序）。
 *
 * 原理：**随机洗牌**整个数组，然后检查它是否已经有序；若否，再洗一次，直到碰巧有序。
 * 这是一个纯粹为教学/恶搞存在的算法，期望时间复杂度为 `O(n·n!)`，**不可用于实际**。
 *
 * 为避免无限循环，本实现强制设置最大尝试次数上限（默认 `maxAttempts = 100000`）；
 * 若超出仍未有序则抛出 `Error`。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function bogoSort(arr: readonly number[], hooks: BogoSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  const isSorted = (): boolean => {
    for (let i = 1; i < n; i++) if (a[i - 1]! > a[i]!) return false;
    return true;
  };

  // Fisher–Yates 洗牌
  const shuffle = (): void => {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
    }
  };

  const maxAttempts = 100000;
  let attempts = 0;
  while (!isSorted()) {
    hooks.onCheck?.(false);
    shuffle();
    attempts++;
    hooks.onShuffle?.(attempts);
    if (attempts >= maxAttempts) {
      throw new Error(`bogoSort: exceeded ${maxAttempts} attempts without sorting`);
    }
  }
  hooks.onCheck?.(true);
  return a;
}
