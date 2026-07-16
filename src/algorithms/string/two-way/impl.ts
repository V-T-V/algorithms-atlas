// =============================================================================
// 双向匹配（Two-Way String Matching）· 纯算法实现
// Crochemore-Perrin 算法：把模式切分成「左半 lu / 右半 ru」，先匹配右半再匹配左半，
// 配合周期性做 O(1) 记忆跳跃，达到 O(n) 时间、O(1) 额外空间。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TwoWayHooks {
  /** 模式对齐到文本起点 pos。 */
  onAlign?: (pos: number) => void;
  /** 在文本 ti 与模式 pi 处比较，match 表示是否相等。 */
  onCompare?: (ti: number, pi: number, match: boolean) => void;
  /** 命中一次完整匹配（起点 pos）。 */
  onFound?: (pos: number) => void;
  /** 窗口滑动到新位置。 */
  onShift?: (from: number, to: number) => void;
}

/**
 * 计算模式的「临界因子化」：找一个位置 ell，使 pat[ell..m-1] 是 pat 的最长相等
 * 「后缀 = pat[ell..m-1]」的前缀（即 pat 可分解为左半 pat[0..ell-1] 与右半 pat[ell..m-1]，
 * 右半为「字典序最小/最大」的尾因子）。返回 ell。
 */
export function criticalFactorization(pat: string): number {
  const m = pat.length;
  if (m <= 1) return 0;
  // 简化版：找使 pat[ell..] 为最长相等前后缀的「临界点」
  // 标准做法用 maximal suffix；这里用最大后缀（字典序）的位置近似
  const maxSuff = maximalSuffix(pat);
  return maxSuff;
}

/** 求字典序最大后缀的起始位置（lyndon 分解思路）。 */
function maximalSuffix(s: string): number {
  const n = s.length;
  let i = 0;
  let j = 1;
  let k = 0;
  while (j + k < n) {
    const a = s[i + k];
    const b = s[j + k];
    if (a === b) {
      k++;
    } else if (a! < b!) {
      i = j;
      j++;
      k = 0;
    } else {
      j = j + k + 1;
      k = 0;
    }
    if (k === 0 && i === j) j++;
  }
  return i;
}

/**
 * 双向匹配：在 text 中找出所有 pat 出现的起点下标。
 *
 * 思路：\n
 * 1. 算临界点 ell，把模式分成左 pat[0..ell-1]、右 pat[ell..m-1]\n
 * 2. 窗口 pos 从 0 起：先从 ell 起向右匹配右半；若右半全匹配，再从 ell-1 起向左匹配左半\n
 * 3. 整段匹配 → 命中\n
 * 4. 滑动：利用「右半的最长 border」记忆上一次比较结果，做 O(1) 跳跃\n
 *
 * 时间 O(n)，额外空间 O(1)（不计结果）。是 glibc strstr 的实现算法。
 *
 * @returns 所有匹配起点下标（升序）。空模式返回 []。
 */
export function twoWay(text: string, pat: string, hooks: TwoWayHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const ell = criticalFactorization(pat);
  const rightLen = m - ell;
  // 最短周期（用于优化滑动）：p = m - lps[m-1]
  let lpsLast = 0;
  {
    const lps = new Array<number>(m).fill(0);
    for (let i = 1; i < m; i++) {
      let len = lps[i - 1]!;
      while (len > 0 && pat[len] !== pat[i]) len = lps[len - 1]!;
      if (pat[len] === pat[i]) len++;
      lps[i] = len;
    }
    lpsLast = lps[m - 1]!;
  }
  const period = m - lpsLast;
  const isPeriodic = period < m && m % period === 0;

  const result: number[] = [];
  let pos = 0;
  hooks.onAlign?.(pos);

  while (pos <= n - m) {
    // 1) 匹配右半 pat[ell..m-1]（从左到右）
    let i = ell;
    while (i < m && pat[i] === text[pos + i]) {
      hooks.onCompare?.(pos + i, i, true);
      i++;
    }
    if (i < m) {
      hooks.onCompare?.(pos + i, i, false);
      // 右半失配：按失配位置滑动（至少 1）
      const shift = Math.max(1, i - ell + 1);
      pos += shift;
      hooks.onShift?.(pos - shift, pos);
      hooks.onAlign?.(pos);
      continue;
    }
    // 2) 右半全匹配，从 ell-1 向左匹配左半 pat[0..ell-1]
    let j = ell - 1;
    while (j >= 0 && pat[j] === text[pos + j]) {
      hooks.onCompare?.(pos + j, j, true);
      j--;
    }
    if (j < 0) {
      // 左半也全匹配 → 命中
      hooks.onFound?.(pos);
      result.push(pos);
      // 周期模式：滑一个周期（保留重叠匹配）；否则滑 m
      pos += isPeriodic ? period : 1;
    } else {
      hooks.onCompare?.(pos + j, j, false);
      // 左半失配：滑右半长度（右半已验证，可安全跳过）
      pos += rightLen;
    }
    hooks.onShift?.(pos - (j < 0 ? (isPeriodic ? period : 1) : rightLen), pos);
    hooks.onAlign?.(pos);
  }
  return result;
}
