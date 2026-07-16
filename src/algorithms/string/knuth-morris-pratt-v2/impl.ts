// =============================================================================
// KMP 完整版（Knuth-Morris-Pratt v2）· 纯算法实现
// 构造前缀函数 + 扫描匹配，报告所有匹配起点。零 DOM 依赖，可独立单测。
// =============================================================================

export interface KMPHooks {
  /** π 构造：确定 π[i]。 */
  onPiSet?: (i: number, value: number) => void;
  /** π 构造：沿失配链回退。 */
  onPiFallback?: (i: number, from: number, to: number) => void;
  /** 匹配阶段：文本下标 i 与模式下标 j 比较。 */
  onMatchCompare?: (i: number, j: number, equal: boolean) => void;
  /** 沿 π 回退模式指针 j。 */
  onMatchFallback?: (i: number, fromJ: number, toJ: number) => void;
  /** 命中匹配，起点 = i - m + 1。 */
  onMatch?: (start: number) => void;
}

/** 构造前缀函数 π（pat[0..i] 最长相等真前后缀长度）。O(m)。 */
export function prefixFunction(pat: string, hooks: KMPHooks = {}): number[] {
  const m = pat.length;
  const pi = new Array<number>(m).fill(0);
  for (let i = 1; i < m; i++) {
    let len = pi[i - 1]!;
    while (len > 0 && pat[len] !== pat[i]) {
      const from = len;
      len = pi[len - 1]!;
      hooks.onPiFallback?.(i, from, len);
    }
    if (pat[len] === pat[i]) len++;
    pi[i] = len;
    hooks.onPiSet?.(i, len);
  }
  return pi;
}

/**
 * KMP 搜索：返回 pat 在 txt 中所有出现的起点下标（升序）。
 * 时间 O(n + m)，空间 O(m)。
 */
export function kmpSearch(txt: string, pat: string, hooks: KMPHooks = {}): number[] {
  const n = txt.length;
  const m = pat.length;
  if (m === 0) return [];
  if (m > n) return [];

  const pi = prefixFunction(pat, hooks);
  const matches: number[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    while (j > 0 && txt[i] !== pat[j]) {
      const fromJ = j;
      j = pi[j - 1]!;
      hooks.onMatchFallback?.(i, fromJ, j);
    }
    const equal = txt[i] === pat[j];
    hooks.onMatchCompare?.(i, j, equal);
    if (equal) j++;
    if (j === m) {
      const start = i - m + 1;
      matches.push(start);
      hooks.onMatch?.(start);
      j = pi[j - 1]!; // 继续找下一处
    }
  }
  return matches;
}
