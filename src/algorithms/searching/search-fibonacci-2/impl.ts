// =============================================================================
// 斐波那契查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onCompare?: (mid: number, value: number, k: number) => void;
}

export function fibonacciSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  // 找最小的 k 使 F(k) >= n+1，迭代重建 fib 三元组
  let fibM2 = 0; // F(k-2)
  let fibM1 = 1; // F(k-1)
  let fibM = fibM2 + fibM1; // F(k)
  while (fibM < n + 1) {
    fibM2 = fibM1;
    fibM1 = fibM;
    fibM = fibM2 + fibM1;
  }
  // 偏移
  let offset = -1;
  while (fibM > 1) {
    const i = Math.min(offset + fibM2, n - 1);
    hooks.onCompare?.(i, arr[i]!, fibM);
    if (arr[i]! < target) {
      // 右段
      fibM = fibM1;
      fibM1 = fibM2;
      fibM2 = fibM - fibM1;
      offset = i;
    } else if (arr[i]! > target) {
      // 左段
      fibM = fibM2;
      fibM1 = fibM1 - fibM2;
      fibM2 = fibM - fibM1;
    } else {
      return i;
    }
  }
  // 检查最后一个
  if (fibM1 === 1 && offset + 1 < n && arr[offset + 1]! === target) {
    return offset + 1;
  }
  return -1;
}
