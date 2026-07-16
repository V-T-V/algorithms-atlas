// =============================================================================
// 最小表示（最小循环移位 / Lexicographically Minimal String Rotation）· 纯算法实现
// 求使 s 的某个循环移位字典序最小的起始下标。Booth 算法 O(n)。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MinimalRotationHooks {
  /** 比较候选起点 i 与 j 在偏移 k 处。 */
  onCompare?: (i: number, j: number, k: number) => void;
  /** 候选起点更新：i 被丢弃，新候选为 newI。 */
  onAdvance?: (i: number, newI: number) => void;
  /** 计算完成，给出最小表示起点。 */
  onDone?: (start: number) => void;
}

/**
 * Booth 算法：求最小循环移位的起始下标。
 *
 * 把 s 复制成 ss = s+s，维护两个候选起点 i、j 与公共前缀长度 k。
 * - ss[i+k] === ss[j+k]：k++\n
 * - ss[i+k] > ss[j+k]：i 落后，i = i+k+1（若 i<=j 则 i=j+1），k=0\n
 * - ss[i+k] < ss[j+k]：j 落后，j = j+k+1（若 j<=i 则 j=i+1），k=0\n
 * 直到 i、j 之一 >= n，剩下的较小者即为答案。
 *
 * 时间 O(n)，空间 O(n)（双倍串）。
 *
 * @returns 最小循环移位的起始下标（0..n-1）；空串返回 0
 */
export function minimalRotation(s: string, hooks: MinimalRotationHooks = {}): number {
  const n = s.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const ss = s + s;
  let i = 0;
  let j = 1;
  let k = 0;
  while (i < n && j < n && k < n) {
    const a = ss[i + k]!;
    const b = ss[j + k]!;
    hooks.onCompare?.(i, j, k);
    if (a === b) {
      k++;
    } else {
      if (a > b) {
        const oldI = i;
        i = i + k + 1;
        if (i <= j) i = j + 1;
        hooks.onAdvance?.(oldI, i);
      } else {
        const oldJ = j;
        j = j + k + 1;
        if (j <= i) j = i + 1;
        hooks.onAdvance?.(oldJ, j);
      }
      k = 0;
    }
  }
  const start = Math.min(i, j);
  hooks.onDone?.(start);
  return start;
}

/** 返回最小循环移位后的字符串本身。 */
export function minRotationString(s: string): string {
  if (s.length === 0) return s;
  const start = minimalRotation(s);
  return s.slice(start) + s.slice(0, start);
}
