// =============================================================================
// KMP 失败指针（LPS 数组）· 纯算法实现
// =============================================================================

export interface LpsHooks {
  /** i 推进，比较 pat[i] 与 pat[j]。 */
  onCompare?: (i: number, j: number, eq: boolean) => void;
  /** j 回退到 lps[j-1]。 */
  onFallback?: (i: number, oldJ: number, newJ: number) => void;
  /** 确定 lps[i] 的值。 */
  onSetLps?: (i: number, value: number) => void;
}

/**
 * 构造 LPS（失败指针）数组。
 * lps[i] = pat[0..i] 的最长「真前缀 = 真后缀」长度（不含整个串本身）。
 */
export function buildLps(pat: string, hooks: LpsHooks = {}): number[] {
  const m = pat.length;
  const lps = new Array<number>(m).fill(0);
  if (m === 0) return lps;
  let j = 0; // 当前匹配的前缀长度
  for (let i = 1; i < m; i++) {
    while (j > 0 && pat[i] !== pat[j]) {
      const oldJ = j;
      j = lps[j - 1]!;
      hooks.onFallback?.(i, oldJ, j);
    }
    hooks.onCompare?.(i, j, pat[i] === pat[j]);
    if (pat[i] === pat[j]) {
      j++;
      lps[i] = j;
    } else {
      lps[i] = 0;
    }
    hooks.onSetLps?.(i, lps[i]!);
  }
  return lps;
}

/** 同时返回「KMP 版」的 next 数组（next[i] = lps[i-1] 风格，部分教材）。 */
export function buildNext(pat: string, hooks: LpsHooks = {}): number[] {
  const lps = buildLps(pat, hooks);
  // next[0] = -1 约定；next[i] = lps[i-1]
  const next = new Array<number>(pat.length).fill(0);
  if (pat.length > 0) next[0] = -1;
  for (let i = 1; i < pat.length; i++) next[i] = lps[i - 1]!;
  return next;
}
