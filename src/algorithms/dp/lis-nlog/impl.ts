// =============================================================================
// 最长递增子序列 LIS（nlogn，二分 + 耐心放置）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 300）：严格递增子序列的最大长度，并可还原一条具体 LIS。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LisNlogHooks {
  /** 处理元素 a[i]，二分定位 pos（覆盖 tails[pos]）。 */
  onVisit?: (i: number, val: number, pos: number) => void;
  /** tails[pos] 被更新为 val。 */
  onPlace?: (pos: number, val: number) => void;
  /** 算法完成：LIS 长度。 */
  onDone?: (length: number) => void;
}

/**
 * 最长严格递增子序列（O(n log n)）。
 *
 * 维护 `tails[k]` = 当前所有「长度为 k+1 的递增子序列」中最小的末尾元素。
 * 对每个 `x = a[i]`，二分找第一个 `tails[pos] >= x`，更新 `tails[pos] = x`（若 pos 超尾则追加，即 LIS 变长）。
 *
 * 还原一条具体 LIS：记录每个元素的「前驱」下标（放置时 pos>0 则前驱是当时 `tails[pos-1]` 对应的下标）。
 *
 * 时间 `O(n log n)`，空间 `O(n)`。求「非降（含等）」改为二分「第一个 `> x`」即可。
 *
 * @param arr 数值数组
 * @returns `{ length, sub }`：LIS 长度，与一条具体 LIS（按下标升序）
 */
export function lisNlog(
  arr: readonly number[],
  hooks: LisNlogHooks = {},
): { length: number; sub: number[] } {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return { length: 0, sub: [] };
  }

  const tails: number[] = []; // tails[k] = 长度 k+1 子序列的最小末尾
  const tailIdx: number[] = []; // tailIdx[k] = tails[k] 对应原数组下标
  const prev: number[] = new Array<number>(n).fill(-1); // 还原路径用

  for (let i = 0; i < n; i++) {
    const x = arr[i]!;
    // 二分：第一个 tails[pos] >= x（严格递增）
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < x) lo = mid + 1;
      else hi = mid;
    }
    const pos = lo;
    hooks.onVisit?.(i, x, pos);

    if (pos === tails.length) {
      tails.push(x);
      tailIdx.push(i);
    } else {
      tails[pos] = x;
      tailIdx[pos] = i;
    }
    hooks.onPlace?.(pos, x);

    if (pos > 0) prev[i] = tailIdx[pos - 1]!;
  }

  // 还原 LIS
  const sub: number[] = [];
  let k = tailIdx[tails.length - 1]!;
  while (k !== -1) {
    sub.push(arr[k]!);
    k = prev[k]!;
  }
  sub.reverse();

  hooks.onDone?.(tails.length);
  return { length: tails.length, sub };
}
