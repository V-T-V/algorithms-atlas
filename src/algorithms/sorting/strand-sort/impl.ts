// =============================================================================
// Strand 排序 Strand Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StrandSortHooks {
  /** 从剩余数组中取出一个新「子链」的起点 v。 */
  onStrandStart?: (v: number) => void;
  /** 把 v 追加到当前子链（保持子链递增）。 */
  onStrandAppend?: (v: number) => void;
  /** 把子链合并进结果，结果长度变为 mergedLen。 */
  onMerge?: (mergedLen: number) => void;
}

/**
 * Strand 排序（Strand Sort）。
 *
 * 原理：反复从剩余数组中抽出一个**递增子链（strand）**——
 * 从头扫描，把所有比子链末尾更大的元素依次取出加入子链；
 * 然后把子链**归并**进已排序的结果。重复直到剩余数组为空。
 *
 * 适合**链表**和**基本有序**的数据（很多元素本就递增，子链很长，归并次数少）。
 *
 * - 平均时间 `O(n²)`，最好（已有序）`O(n)`
 * - 空间 `O(n)`
 * - 稳定性：**稳定**
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function strandSort(arr: readonly number[], hooks: StrandSortHooks = {}): number[] {
  let remaining = [...arr];
  let result: number[] = [];

  while (remaining.length > 0) {
    // 取出一条递增子链
    const strand: number[] = [];
    const next: number[] = [];
    const head = remaining[0]!;
    strand.push(head);
    hooks.onStrandStart?.(head);
    for (let i = 1; i < remaining.length; i++) {
      const v = remaining[i]!;
      if (v >= strand[strand.length - 1]!) {
        strand.push(v);
        hooks.onStrandAppend?.(v);
      } else {
        next.push(v);
      }
    }
    remaining = next;

    // 把 strand 归并进 result
    result = merge(result, strand);
    hooks.onMerge?.(result.length);
  }
  return result;
}

/** 两个已排序数组的稳定归并。 */
function merge(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i]! <= b[j]!) out.push(a[i++]!);
    else out.push(b[j++]!);
  }
  while (i < a.length) out.push(a[i++]!);
  while (j < b.length) out.push(b[j++]!);
  return out;
}
