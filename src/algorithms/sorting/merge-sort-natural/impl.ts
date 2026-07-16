// =============================================================================
// 自然归并排序（Natural Merge Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NaturalMergeHooks {
  /** 初始扫描识别到一个有序段 [lo, hi)。 */
  onRun?: (lo: number, hi: number) => void;
  /** 开始一轮归并（本轮 run 数 = runCount）。 */
  onRound?: (round: number, runCount: number) => void;
  /** 归并相邻两段 [aLo, aMid) 与 [aMid, aHi) 到 [aLo, aHi)。 */
  onMerge?: (aLo: number, aMid: number, aHi: number) => void;
}

/** 扫描出输入中所有天然有序段的端点（每段 [lo, hi) 非降序）。 */
export function findRuns(arr: readonly number[]): number[] {
  const n = arr.length;
  const bounds: number[] = [0]; // 每段起点 + 末尾
  let i = 0;
  while (i < n) {
    let j = i + 1;
    while (j < n && arr[j - 1]! <= arr[j]!) j++;
    bounds.push(j);
    i = j;
  }
  return bounds; // 长度 = run 数 + 1
}

/** 把有序段 [lo, mid) 与 [mid, hi) 归并回 a[lo, hi)。需要临时数组。 */
function merge(a: number[], lo: number, mid: number, hi: number): void {
  const left = a.slice(lo, mid);
  const right = a.slice(mid, hi);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    if (left[i]! <= right[j]!) a[k++] = left[i++]!;
    else a[k++] = right[j++]!;
  }
  while (i < left.length) a[k++] = left[i++]!;
  while (j < right.length) a[k++] = right[j++]!;
}

/**
 * 自然归并排序：先识别天然有序段，再逐轮两两归并。
 * 时间 O(n log n)（已有序时 O(n)），空间 O(n)，稳定。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function naturalMergeSort(arr: readonly number[], hooks: NaturalMergeHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  // 初始 run 端点
  let bounds = findRuns(a);
  for (let r = 0; r < bounds.length - 1; r++) {
    hooks.onRun?.(bounds[r]!, bounds[r + 1]!);
  }

  let round = 0;
  while (bounds.length > 2) {
    hooks.onRound?.(round, bounds.length - 1);
    const next: number[] = [0];
    for (let r = 0; r < bounds.length - 1; r += 2) {
      const lo = bounds[r]!;
      const mid = bounds[r + 1]!;
      const hi = r + 2 < bounds.length ? bounds[r + 2]! : mid;
      if (hi > mid) {
        merge(a, lo, mid, hi);
        hooks.onMerge?.(lo, mid, hi);
      }
      next.push(hi);
    }
    bounds = next;
    round++;
  }
  return a;
}
