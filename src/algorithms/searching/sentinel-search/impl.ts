// =============================================================================
// 哨兵查找（Sentinel Search）· 纯算法实现
// 把 target 放在末尾作哨兵，省去每次循环的越界判断，线性 O(n)。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SentinelSearchHooks {
  /** 在位置 i 比较 arr[i] 与 target。 */
  onCompare?: (i: number, equal: boolean) => void;
  /** 计算完成。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 哨兵线性查找：在数组中找 target。
 * 实现用「先放哨兵再扫描」的思想（不修改原数组，复制一份）。
 * @returns 下标；不存在返回 -1。
 */
export function sentinelSearch(
  arr: readonly number[],
  target: number,
  hooks: SentinelSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  // 把末尾暂存为哨兵位置（概念上 arr[n] = target）
  const last = arr[n - 1]!;
  let i = 0;
  // 若 target 就在末尾，直接命中；否则把末尾当哨兵扫描前 n-1 个
  if (last === target) {
    hooks.onCompare?.(n - 1, true);
    hooks.onDone?.(n - 1);
    return n - 1;
  }
  // 临时把末尾置为 target（复制数组，不改原数组）
  const buf = [...arr];
  buf[n - 1] = target;
  while (buf[i]! !== target) {
    hooks.onCompare?.(i, false);
    i++;
  }
  buf[n - 1] = last; // 还原
  if (i < n - 1) {
    hooks.onCompare?.(i, true);
    hooks.onDone?.(i);
    return i;
  }
  // 扫到哨兵仍未在前 n-1 命中 → 不存在
  hooks.onDone?.(-1);
  return -1;
}
