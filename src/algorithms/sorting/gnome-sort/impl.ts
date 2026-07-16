// =============================================================================
// 侏儒排序 Gnome Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GnomeSortHooks {
  /** 比较下标 i、i-1 的元素。 */
  onCompare?: (i: number, prev: number) => void;
  /** 交换下标 i、i-1。 */
  onSwap?: (i: number, prev: number) => void;
  /** 游标移动到下标 i（向前走或后退）。 */
  onMove?: (i: number) => void;
}

/**
 * 侏儒排序（Stupid Sort）：用一个游标 i 从左向右走，
 * 若 a[i] >= a[i-1] 则前进一步，否则交换 a[i] 与 a[i-1] 并后退一步。
 * 像侏儒花匠「错则回头」。原地、稳定。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function gnomeSort(arr: readonly number[], hooks: GnomeSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  let i = 1;
  while (i < n) {
    if (i === 0) {
      i = 1;
      hooks.onMove?.(i);
      continue;
    }
    hooks.onCompare?.(i, i - 1);
    if (a[i]! >= a[i - 1]!) {
      // 有序，前进
      i++;
      hooks.onMove?.(i);
    } else {
      // 交换并后退
      const t = a[i]!;
      a[i] = a[i - 1]!;
      a[i - 1] = t;
      hooks.onSwap?.(i, i - 1);
      i--;
      hooks.onMove?.(i);
    }
  }
  return a;
}
