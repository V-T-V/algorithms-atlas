// =============================================================================
// 下一个排列 · 纯算法实现
// =============================================================================

export interface NextPermHooks {
  onSwap?: (i: number, j: number) => void;
  onReverse?: (lo: number, hi: number) => void;
}

/** 原地求下一个排列，返回是否还有下一个（false 表示已回绕到最小）。 */
export function nextPermutation(arr: number[], hooks: NextPermHooks = {}): boolean {
  const n = arr.length;
  if (n < 2) return false;
  // 1. 找降序断点
  let i = n - 2;
  while (i >= 0 && arr[i]! >= arr[i + 1]!) i--;
  if (i < 0) {
    // 已是最大，翻转
    reverse(arr, 0, n - 1, hooks);
    return false;
  }
  // 2. 找右边第一个 > arr[i]
  let j = n - 1;
  while (arr[j]! <= arr[i]!) j--;
  [arr[i]!, arr[j]!] = [arr[j]!, arr[i]!];
  hooks.onSwap?.(i, j);
  // 3. 反转 i+1..
  reverse(arr, i + 1, n - 1, hooks);
  return true;
}

function reverse(arr: number[], lo: number, hi: number, hooks: NextPermHooks): void {
  hooks.onReverse?.(lo, hi);
  while (lo < hi) {
    [arr[lo]!, arr[hi]!] = [arr[hi]!, arr[lo]!];
    lo++;
    hi--;
  }
}

/** 构造全排列序列（前 k 个）。 */
export function generatePermutations(initial: number[], count: number): number[][] {
  const result: number[][] = [];
  const arr = [...initial];
  result.push([...arr]);
  for (let k = 1; k < count; k++) {
    if (!nextPermutation(arr)) break;
    result.push([...arr]);
  }
  return result;
}
