// =============================================================================
// 计数排序 · 纯算法实现（稳定版）
// 1. count[v] 统计频次
// 2. count 前缀和 → count[v] = 值 <= v 的个数
// 3. 从后向前扫描原数组，out[--count[a[i]]] = a[i]
// =============================================================================

export interface CountingSortHooks {
  onCount?: (value: number, counts: number[]) => void;
  onPrefixSum?: (counts: number[]) => void;
  onPlace?: (inputIndex: number, value: number, outputIndex: number, output: number[]) => void;
  onDone?: (output: number[]) => void;
}

/**
 * 稳定计数排序。
 * @param arr 输入数组（非负整数）
 * @param k 值域上界（默认 max(arr)）
 */
export function countingSort(
  arr: readonly number[],
  k?: number,
  hooks: CountingSortHooks = {},
): number[] {
  const n = arr.length;
  if (n === 0) return [];
  // 校验非负
  for (const v of arr) {
    if (!Number.isInteger(v) || v < 0)
      throw new RangeError('countingSort requires non-negative integers');
  }
  let maxVal = k ?? 0;
  if (k === undefined) {
    for (const v of arr) if (v > maxVal) maxVal = v;
  }
  const count = new Array<number>(maxVal + 1).fill(0);
  // 统计
  for (const v of arr) {
    count[v] = count[v]! + 1;
    hooks.onCount?.(v, [...count]);
  }
  // 前缀和
  for (let i = 1; i <= maxVal; i++) {
    count[i] = count[i]! + count[i - 1]!;
  }
  hooks.onPrefixSum?.([...count]);
  // 反向回填（稳定）
  const out = new Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const v = arr[i]!;
    count[v] = count[v]! - 1;
    const pos = count[v]!;
    out[pos] = v;
    hooks.onPlace?.(i, v, pos, [...out]);
  }
  hooks.onDone?.([...out]);
  return out;
}
