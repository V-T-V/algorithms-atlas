// =============================================================================
// 鸽巢排序 Pigeonhole Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PigeonholeSortHooks {
  /** 把值 v 放进它的「鸽巢」holeIdx。 */
  onPlace?: (v: number, holeIdx: number) => void;
  /** 按顺序从鸽巢 holeIdx 收回值 v（写出）。 */
  onCollect?: (v: number, holeIdx: number) => void;
}

/**
 * 鸽巢排序（Pigeonhole Sort）。
 *
 * 原理：适用于**取值范围较小**的非负整数（或可映射到小范围的键）。
 * - 设 `range = max − min + 1`，开 `range` 个「鸽巢」
 * - 把每个元素放入下标为 `value − min` 的鸽巢（计数）
 * - 按鸽巢顺序依次把元素回收，即得升序结果
 *
 * - 时间 `O(n + range)`
 * - 空间 `O(range)`
 * - 稳定性：**稳定**（按入巢顺序回收）
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function pigeonholeSort(arr: readonly number[], hooks: PigeonholeSortHooks = {}): number[] {
  const n = arr.length;
  if (n <= 1) return [...arr];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (min < 0) throw new RangeError('pigeonholeSort: this impl supports non-negative integers');

  const range = max - min + 1;
  // 每个鸽巢存一个 FIFO 列表，保证稳定
  const holes: number[][] = Array.from({ length: range }, () => []);

  for (const v of arr) {
    const idx = v - min;
    holes[idx]!.push(v);
    hooks.onPlace?.(v, idx);
  }

  const out: number[] = [];
  for (let i = 0; i < range; i++) {
    for (const v of holes[i]!) {
      out.push(v);
      hooks.onCollect?.(v, i);
    }
  }
  return out;
}
