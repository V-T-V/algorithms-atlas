// =============================================================================
// 两个有序数组的中位数 · 纯算法实现
// 经典二分划分法，O(log(min(m,n)))。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface MedianOfTwoSortedHooks {
  /** 一次二分尝试：在 a 上的切分 i，b 上的切分 j。 */
  onPartition?: (i: number, j: number) => void;
  /** 找到合法划分，给出左半最大与右半最小。 */
  onValid?: (leftMax: number, rightMin: number) => void;
  /** 算法结束，给出最终中位数。 */
  onDone?: (median: number) => void;
}

const NEG_INF = -Infinity;
const POS_INF = Infinity;

/**
 * 两个升序数组的中位数（O(log(min(m,n)))）。
 *
 * @param a 升序数组
 * @param b 升序数组
 * @param hooks 可选事件钩子
 * @returns 合并后的中位数（偶数长度取平均）
 */
export function medianOfTwoSorted(
  a: readonly number[],
  b: readonly number[],
  hooks: MedianOfTwoSortedHooks = {},
): number {
  // 让 a 是较短的那个，保证二分范围合理
  let A = a;
  let B = b;
  if (a.length > b.length) {
    A = b;
    B = a;
  }
  const m = A.length;
  const n = B.length;
  if (m === 0 && n === 0) throw new RangeError('两个数组均空');

  const halfTotal = (m + n + 1) >> 1; // 左半应有的元素数

  let lo = 0;
  let hi = m;

  while (lo <= hi) {
    const i = (lo + hi) >> 1; // A 的切分：A[0..i-1] 入左半
    const j = halfTotal - i; // B 的切分：B[0..j-1] 入左半
    hooks.onPartition?.(i, j);

    const aLeft = i === 0 ? NEG_INF : A[i - 1]!;
    const aRight = i === m ? POS_INF : A[i]!;
    const bLeft = j === 0 ? NEG_INF : B[j - 1]!;
    const bRight = j === n ? POS_INF : B[j]!;

    if (aLeft <= bRight && bLeft <= aRight) {
      // 合法划分
      const leftMax = aLeft > bLeft ? aLeft : bLeft;
      const rightMin = aRight < bRight ? aRight : bRight;
      hooks.onValid?.(leftMax, rightMin);
      const median = (m + n) % 2 === 1 ? leftMax : (leftMax + rightMin) / 2;
      hooks.onDone?.(median);
      return median;
    } else if (aLeft > bRight) {
      // A 切多了，向左
      hi = i - 1;
    } else {
      lo = i + 1;
    }
  }
  // 不可达
  throw new Error('medianOfTwoSorted: 输入可能未排序');
}
