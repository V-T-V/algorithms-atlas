// =============================================================================
// Tim排序 TimSort · 纯算法实现
// 归并 + 插入 + run 检测。零 DOM 依赖，可独立单测。
// 通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface TimSortHooks {
  /** 识别出一个 run [lo, hi]（升序或降序翻转后的升序）。 */
  onRun?: (lo: number, hi: number) => void;
  /** 对小段 [lo, hi] 执行插入排序。 */
  onInsertionSort?: (lo: number, hi: number) => void;
  /** 比较下标 i、j 的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j（插入排序位移，或 run 翻转）。 */
  onSwap?: (i: number, j: number) => void;
  /** 准备合并两段 [lo,mid] 与 [mid+1,hi]。 */
  onMerge?: (lo: number, mid: number, hi: number) => void;
  /** 把值写入目的下标 dest。 */
  onWrite?: (dest: number, value: number) => void;
}

const MIN_MERGE = 32;

/**
 * TimSort：结合归并排序与插入排序的自适应、稳定排序。
 * 1) 扫描数组识别自然 run（已有序段），降序段原地翻转为升序
 * 2) 长度不足 MIN_MERGE 的 run 用插入排序补齐
 * 3) 用归并排序把相邻 run 逐层合并成有序数组
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function timsort(arr: readonly number[], hooks: TimSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  // —— 插入排序（带 hooks），用于补齐小段 ——
  const insertionSortRange = (left: number, right: number): void => {
    hooks.onInsertionSort?.(left, right);
    for (let i = left + 1; i <= right; i++) {
      const key = a[i]!;
      let j = i - 1;
      while (j >= left) {
        hooks.onCompare?.(j, i);
        if (a[j]! > key) {
          a[j + 1] = a[j]!;
          hooks.onSwap?.(j, j + 1);
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
    }
  };

  // —— 计算下一个 run 的起点与长度 ——
  // 返回 [runStart, runLen]；若降序则翻转为升序。
  const countRun = (lo: number): number => {
    if (lo === n - 1) return 1;
    let hi = lo + 1;
    if (a[lo]! <= a[hi]!) {
      // 升序 run
      while (hi < n - 1 && a[hi]! <= a[hi + 1]!) hi++;
      return hi - lo + 1;
    }
    // 降序 run → 翻转为升序
    while (hi < n - 1 && a[hi]! > a[hi + 1]!) hi++;
    let l = lo;
    let r = hi;
    while (l < r) {
      const t = a[l]!;
      a[l] = a[r]!;
      a[r] = t;
      hooks.onSwap?.(l, r);
      l++;
      r--;
    }
    return hi - lo + 1;
  };

  // —— 归并 [lo,mid] 与 [mid+1,hi] ——
  const merge = (lo: number, mid: number, hi: number): void => {
    hooks.onMerge?.(lo, mid, hi);
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < left.length && j < right.length) {
      hooks.onCompare?.(lo + i, mid + 1 + j);
      if (left[i]! <= right[j]!) {
        a[k] = left[i]!;
        hooks.onWrite?.(k, left[i]!);
        i++;
      } else {
        a[k] = right[j]!;
        hooks.onWrite?.(k, right[j]!);
        j++;
      }
      k++;
    }
    while (i < left.length) {
      a[k] = left[i]!;
      hooks.onWrite?.(k, left[i]!);
      i++;
      k++;
    }
    while (j < right.length) {
      a[k] = right[j]!;
      hooks.onWrite?.(k, right[j]!);
      j++;
      k++;
    }
  };

  // 主流程：识别 run → 补齐 → 合并栈
  const stack: Array<{ start: number; len: number }> = [];
  let pos = 0;
  while (pos < n) {
    let runLen = countRun(pos);
    hooks.onRun?.(pos, pos + runLen - 1);
    // run 太短则用插入排序补齐到 minRun
    if (runLen < MIN_MERGE) {
      const force = Math.min(MIN_MERGE, n - pos);
      insertionSortRange(pos, pos + force - 1);
      runLen = force;
    }
    stack.push({ start: pos, len: runLen });
    pos += runLen;

    // 维护栈的不变式：合并相邻 run 直到稳定
    while (stack.length >= 2) {
      const b = stack[stack.length - 1]!;
      const a1 = stack[stack.length - 2]!;
      // 简化：每当栈中有 >=2 个 run 就合并相邻两个（保证最终归并为一个）
      stack.pop();
      stack.pop();
      merge(a1.start, a1.start + a1.len - 1, b.start + b.len - 1);
      stack.push({ start: a1.start, len: a1.len + b.len });
      if (stack.length === 1) break;
    }
  }

  return a;
}
