// =============================================================================
// Lyndon 词判定与构造 · 纯算法实现
// Lyndon 词：严格小于其所有真循环移位的字符串（等价：严格小于其所有真后缀）。
// 提供：(1) 判定一个串是否为 Lyndon 词；(2) 求串的最小表示/最小循环移位；
// (3) Chen-Fox-Lyndon 分解（与 duval 一致，这里给出独立实现）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LyndonHooks {
  /** Duval 分解确定一个 Lyndon 因子 [start, end)。 */
  onFactor?: (start: number, end: number) => void;
  /** 最小表示搜索：候选起点 i 比对位置 k。 */
  onCompare?: (i: number, j: number, k: number) => void;
  /** 计算完成。 */
  onDone?: () => void;
}

/**
 * 判定字符串 s 是否为 Lyndon 词。
 * Lyndon 词严格小于其所有真循环移位（等价：严格小于其所有真后缀）。
 * 时间 O(n^2)（朴素，演示用）。
 */
export function isLyndon(s: string): boolean {
  const n = s.length;
  if (n === 0) return false;
  const doubled = s + s;
  for (let i = 1; i < n; i++) {
    // 任一非平凡循环移位必须严格大于 s
    if (doubled.slice(i, i + n) <= s) return false;
  }
  return true;
}

/**
 * Duval（Chen-Fox-Lyndon）分解：把 s 唯一分解成字典序非递增的 Lyndon 词序列。
 * 与 duval 算法一致，返回各因子的 [start, end) 区间。
 * 时间 O(n)，空间 O(因子数)。
 *
 * @returns Lyndon 因子的 [start, end) 区间列表
 */
export function lyndon(s: string, hooks: LyndonHooks = {}): Array<[number, number]> {
  const n = s.length;
  const factors: Array<[number, number]> = [];
  let i = 0;
  while (i < n) {
    let j = i + 1;
    let k = i;
    while (j < n) {
      const sj = s[j]!;
      const sk = s[k]!;
      if (sj > sk) {
        hooks.onCompare?.(i, j, k);
        j++;
        k = i;
      } else if (sj < sk) {
        break;
      } else {
        hooks.onCompare?.(i, j, k);
        j++;
        k++;
      }
    }
    const period = j - k;
    while (i <= k) {
      const end = i + period;
      factors.push([i, Math.min(end, n)]);
      hooks.onFactor?.(i, Math.min(end, n));
      i = end;
    }
  }
  hooks.onDone?.();
  return factors;
}

/**
 * 最小表示（最小循环移位）的起始下标：Booth 算法 / Duval 思路。
 * 返回使 s[i..]+s[..i] 字典序最小的 i。
 * 时间 O(n)，空间 O(n)。
 */
export function minRotation(s: string, hooks: LyndonHooks = {}): number {
  const n = s.length;
  if (n === 0) return 0;
  const doubled = s + s;
  let i = 0;
  let j = 1;
  let k = 0;
  while (i < n && j < n && k < n) {
    const a = doubled[i + k]!;
    const b = doubled[j + k]!;
    hooks.onCompare?.(i, j, k);
    if (a === b) {
      k++;
    } else if (a < b) {
      j = j + k + 1;
      if (j <= i) j = i + 1;
      k = 0;
    } else {
      i = i + k + 1;
      if (i <= j) i = j + 1;
      k = 0;
    }
  }
  hooks.onDone?.();
  return Math.min(i, j);
}
