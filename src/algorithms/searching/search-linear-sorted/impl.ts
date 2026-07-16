// =============================================================================
// 有序线性查找 · 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (i: number, value: number, bail: boolean) => void;
}

export function linearSearchSorted(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]! === target) {
      hooks.onCompare?.(i, arr[i]!, false);
      return i;
    }
    if (arr[i]! > target) {
      hooks.onCompare?.(i, arr[i]!, true);
      return -1;
    }
    hooks.onCompare?.(i, arr[i]!, false);
  }
  return -1;
}
