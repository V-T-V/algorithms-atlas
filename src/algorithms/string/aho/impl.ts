// =============================================================================
// Aho 搜索（单模式 Aho-Corasick 风格 / KMP 自动机搜索）· 纯算法实现
// 单模式串匹配：先用前缀函数构造一个「不回溯文本指针」的转移自动机，
// 再一遍扫描文本。本质是 KMP 的 DFA 形式。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AhoHooks {
  /** 构造期间：确定转移 trans[q][ch] = nextQ。 */
  onBuildTrans?: (q: number, ch: string, nextQ: number) => void;
  /** 匹配期间：读入 text[i]，状态从 q 转到 nextQ。 */
  onTransfer?: (i: number, q: number, nextQ: number, ch: string) => void;
  /** 命中一次完整匹配（结束下标 i）。 */
  onFound?: (i: number) => void;
}

/**
 * 构造单模式匹配自动机（DFA）。
 * trans[q][ch] = 读入 ch 后从状态 q（已匹配前 q 个字符）转到的状态。
 */
export function buildAhoAutomaton(
  pat: string,
  alphabet: string,
  hooks: AhoHooks = {},
): Record<string, number>[] {
  const m = pat.length;
  const pi = new Array<number>(m).fill(0);
  for (let i = 1; i < m; i++) {
    let len = pi[i - 1]!;
    while (len > 0 && pat[len] !== pat[i]) len = pi[len - 1]!;
    if (pat[len] === pat[i]) len++;
    pi[i] = len;
  }
  const trans: Record<string, number>[] = [];
  for (let q = 0; q <= m; q++) trans.push({});
  for (let q = 0; q <= m; q++) {
    for (const ch of alphabet) {
      let nextQ: number;
      if (q < m && pat[q] === ch) nextQ = q + 1;
      else if (q > 0) nextQ = trans[pi[q - 1]!]![ch]!;
      else nextQ = 0;
      trans[q]![ch] = nextQ;
      hooks.onBuildTrans?.(q, ch, nextQ);
    }
  }
  return trans;
}

/**
 * Aho 搜索：构造单模式自动机并扫描文本，返回所有匹配起点下标。
 *
 * 状态 q=m 即命中（结束于 i，起点 i-m+1）。
 * 时间 O(n)（扫描）+ O(m·|Σ|)（构造），空间 O(m·|Σ|)。
 *
 * @returns 所有匹配起点下标（升序）。空模式返回 []。
 */
export function aho(text: string, pat: string, hooks: AhoHooks = {}): number[] {
  const m = pat.length;
  if (m === 0 || m > text.length) return [];
  const alpha = Array.from(new Set([...text, ...pat])).join('');
  const trans = buildAhoAutomaton(pat, alpha, hooks);
  const result: number[] = [];
  let q = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const nextQ = trans[q]![ch] ?? 0;
    hooks.onTransfer?.(i, q, nextQ, ch);
    q = nextQ;
    if (q === m) {
      hooks.onFound?.(i);
      result.push(i - m + 1);
    }
  }
  return result;
}
