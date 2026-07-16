// =============================================================================
// Meta 二分查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onBit?: (bit: number, candidate: number, value: number, accepted: boolean) => void;
}

export function metaBinarySearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  // 计算 bits
  let bits = 0;
  while (1 << bits < n) bits++;
  let pos = 0;
  for (let bit = bits - 1; bit >= 0; bit--) {
    const candidate = pos | (1 << bit);
    if (candidate < n && arr[candidate]! <= target) {
      hooks.onBit?.(bit, candidate, arr[candidate]!, true);
      pos = candidate;
    } else {
      hooks.onBit?.(bit, candidate, candidate < n ? arr[candidate]! : Number.NaN, false);
    }
  }
  return arr[pos]! === target ? pos : -1;
}
