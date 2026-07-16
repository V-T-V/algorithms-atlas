// 查找差值对 · 纯算法实现
export interface PairDiffHooks {
  onCompare?: (i: number, j: number) => void;
}

export function pairWithDifference(
  arr: readonly number[],
  d: number,
  hooks: PairDiffHooks = {},
): [number, number] {
  let i = 0,
    j = 1;
  const n = arr.length;
  while (i < n && j < n) {
    hooks.onCompare?.(i, j);
    if (i === j) {
      j++;
      continue;
    }
    const diff = arr[j]! - arr[i]!;
    if (diff === d) return [i, j];
    if (diff < d) j++;
    else i++;
  }
  return [-1, -1];
}
