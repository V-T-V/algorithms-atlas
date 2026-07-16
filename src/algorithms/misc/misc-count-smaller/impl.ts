// =============================================================================
// 计数较小数 · 纯算法实现
// 带索引的归并排序。
// =============================================================================

export interface CountSmallerHooks {
  onMerge?: (leftIdx: number, rightIdx: number, increment: number) => void;
}

export function countSmaller(nums: readonly number[], hooks: CountSmallerHooks = {}): number[] {
  const n = nums.length;
  const counts = new Array<number>(n).fill(0);
  // 索引数组：indices[i] = 当前位置上原本的下标
  const indices = nums.map((_, i) => i);
  const temp = new Array<number>(n).fill(0);

  function mergeSort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  function merge(lo: number, mid: number, hi: number): void {
    for (let k = lo; k <= hi; k++) temp[k] = indices[k]!;
    let i = lo;
    let j = mid + 1;
    let k = lo;
    while (i <= mid && j <= hi) {
      if (nums[temp[i]!]! <= nums[temp[j]!]!) {
        // 左元素入队：右侧 [mid+1, j) 都比它小
        const rightCount = j - (mid + 1);
        counts[temp[i]!]! += rightCount;
        hooks.onMerge?.(temp[i]!, temp[j]!, rightCount);
        indices[k] = temp[i]!;
        i++;
      } else {
        indices[k] = temp[j]!;
        j++;
      }
      k++;
    }
    while (i <= mid) {
      const rightCount = j - (mid + 1);
      counts[temp[i]!]! += rightCount;
      hooks.onMerge?.(temp[i]!, -1, rightCount);
      indices[k] = temp[i]!;
      i++;
      k++;
    }
    while (j <= hi) {
      indices[k] = temp[j]!;
      j++;
      k++;
    }
  }

  mergeSort(0, n - 1);
  return counts;
}

/** 暴力 O(n^2) 验证。 */
export function countSmallerBrute(nums: readonly number[]): number[] {
  return nums.map((v, i) => {
    let c = 0;
    for (let j = i + 1; j < nums.length; j++) if (nums[j]! < v) c++;
    return c;
  });
}
