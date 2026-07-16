// =============================================================================
// 紧凑 Tim 排序（Compact Tim Sort）· 纯算法实现
// 自适应：自然 run 检测 + 小段插入 + 自底向上归并。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CompactTimHooks {
  /** 识别出一个 run [lo, hi]（含两端）。 */
  onRun?: (lo: number, hi: number) => void;
  /** 对小段 [lo, hi] 执行插入排序补齐。 */
  onInsertion?: (lo: number, hi: number) => void;
  /** 准备合并两段 [lo,mid] 与 (mid,hi]。 */
  onMerge?: (lo: number, mid: number, hi: number) => void;
  /** 翻转降序 run 为升序（区间 [lo,hi]）。 */
  onFlip?: (lo: number, hi: number) => void;
}

const MIN_MERGE = 16;

/** 对 a[lo..hi] 做原地插入排序（含两端）。 */
function insertionSort(a: number[], lo: number, hi: number): void {
  for (let i = lo + 1; i <= hi; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= lo && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}

/** 稳定归并 a[lo..mid] 与 a[mid+1..hi]，二者均已升序。用辅助数组。 */
function merge(a: number[], lo: number, mid: number, hi: number): void {
  const left = a.slice(lo, mid + 1);
  const right = a.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    // <= 保持稳定（左侧相等者先）
    if (left[i]! <= right[j]!) {
      a[k] = left[i]!;
      i++;
    } else {
      a[k] = right[j]!;
      j++;
    }
    k++;
  }
  while (i < left.length) {
    a[k] = left[i]!;
    i++;
    k++;
  }
  while (j < right.length) {
    a[k] = right[j]!;
    j++;
    k++;
  }
}

/**
 * 紧凑 Tim 排序。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function compactTimSort(arr: readonly number[], hooks: CompactTimHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  // 1) 把数组切成若干 run，短 run 用插入排序补齐到 minRun
  const runs: Array<{ lo: number; hi: number }> = [];
  let pos = 0;
  while (pos < n) {
    let hi = pos + 1;
    if (hi < n) {
      if (a[pos]! <= a[hi]!) {
        // 升序 run
        while (hi < n - 1 && a[hi]! <= a[hi + 1]!) hi++;
      } else {
        // 降序 run → 翻转为升序
        while (hi < n - 1 && a[hi]! > a[hi + 1]!) hi++;
        let l = pos;
        let r = hi;
        hooks.onFlip?.(pos, hi);
        while (l < r) {
          const t = a[l]!;
          a[l] = a[r]!;
          a[r] = t;
          l++;
          r--;
        }
      }
    }
    // 补齐到 minRun
    const forceEnd = Math.min(n - 1, pos + MIN_MERGE - 1);
    if (forceEnd > hi) {
      insertionSort(a, pos, forceEnd);
      hooks.onInsertion?.(pos, forceEnd);
      hi = forceEnd;
    }
    hooks.onRun?.(pos, hi);
    runs.push({ lo: pos, hi });
    pos = hi + 1;
  }

  // 2) 自底向上两两归并（不依赖 run 栈不变式）
  while (runs.length > 1) {
    const next: Array<{ lo: number; hi: number }> = [];
    for (let i = 0; i < runs.length; i += 2) {
      if (i + 1 < runs.length) {
        const l = runs[i]!;
        const r = runs[i + 1]!;
        hooks.onMerge?.(l.lo, l.hi, r.hi);
        merge(a, l.lo, l.hi, r.hi);
        next.push({ lo: l.lo, hi: r.hi });
      } else {
        next.push(runs[i]!);
      }
    }
    runs.splice(0, runs.length, ...next);
  }

  return a;
}
