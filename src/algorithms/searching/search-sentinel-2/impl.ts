// =============================================================================
// 哨兵线性查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (i: number, value: number) => void;
}

export function sentinelSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  // 构造带哨兵的副本（避免修改原数组）
  const ext = [...arr, target];
  let i = 0;
  while (ext[i]! !== target) {
    hooks.onCompare?.(i, ext[i]!);
    i++;
  }
  // i 落在 [0, n) 表示真的命中；i == n 表示命中哨兵
  return i < n ? i : -1;
}

/** 不分配额外空间的版本：对原数组就地（若末元素已等于 target 则不可用）变体。这里给出安全版本。 */
export function sentinelSearchInPlace(arr: number[], target: number): number {
  const n = arr.length;
  if (n === 0) return -1;
  const last = arr[n - 1]!;
  arr[n - 1] = target;
  let i = 0;
  while (arr[i]! !== target) i++;
  arr[n - 1] = last;
  if (i < n - 1) return i;
  return last === target ? n - 1 : -1;
}
