// =============================================================================
// 最长快乐前缀 · 纯算法实现
// =============================================================================

export interface HappyHooks {
  /** 确定 lps[i]。 */
  onSetLps?: (i: number, value: number) => void;
  /** j 回退。 */
  onFallback?: (i: number, oldJ: number, newJ: number) => void;
  onResult?: (length: number) => void;
}

/** 计算整个 lps 数组。 */
export function buildLps(s: string, hooks: HappyHooks = {}): number[] {
  const n = s.length;
  const lps = new Array<number>(n).fill(0);
  let j = 0;
  for (let i = 1; i < n; i++) {
    while (j > 0 && s[i] !== s[j]) {
      const old = j;
      j = lps[j - 1]!;
      hooks.onFallback?.(i, old, j);
    }
    if (s[i] === s[j]) {
      j++;
      lps[i] = j;
    } else {
      lps[i] = 0;
    }
    hooks.onSetLps?.(i, lps[i]!);
  }
  return lps;
}

/** 求最长快乐前缀长度。 */
export function longestHappyPrefixLength(s: string, hooks: HappyHooks = {}): number {
  if (s.length === 0) return 0;
  const lps = buildLps(s, hooks);
  const len = lps[s.length - 1]!;
  hooks.onResult?.(len);
  return len;
}

/** 求最长快乐前缀串。 */
export function longestHappyPrefix(s: string, hooks: HappyHooks = {}): string {
  const len = longestHappyPrefixLength(s, hooks);
  return s.slice(0, len);
}
