// =============================================================================
// 字符串匹配自动机（String Matching Automaton / DFA）· 纯算法实现
// 把单模式匹配构造成一个 DFA：状态数 m+1，状态 q 表示「已匹配模式前 q 个字符」。
// 构造好后扫描文本一遍 O(n) 即可，每个字符一次状态转移（无回溯）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StringMatchAutomatonHooks {
  /** 构造期间：确定转移 trans[q][c] = nextQ。 */
  onBuildTrans?: (q: number, ch: string, nextQ: number) => void;
  /** 匹配期间：读入 text[i]，状态从 q 转到 nextQ。 */
  onTransfer?: (i: number, q: number, nextQ: number, ch: string) => void;
  /** 命中一次完整匹配（结束下标 i）。 */
  onFound?: (i: number) => void;
}

/**
 * 构造字符串匹配 DFA 的转移表：`trans[q][ch]` = 读入字符 ch 后从状态 q 转到的状态。
 *
 * 状态 q（0..m）表示「当前文本后缀与模式前缀的最长公共长度 = q」。
 * 构造方式：`trans[q][pat[q]] = q+1`；其余字符借助前缀函数「回退」：
 *   若 ch != pat[q]，则 trans[q][ch] = trans[π(q)][ch]（π 为前缀函数）。
 *
 * 时间 O(m·|Σ|)，空间 O(m·|Σ|)。
 *
 * @returns 转移表 trans（二维：状态 → 字符 → 状态）
 */
export function buildMatchAutomaton(
  pat: string,
  alphabet: string,
  hooks: StringMatchAutomatonHooks = {},
): Record<string, number>[] {
  const m = pat.length;
  // 前缀函数
  const pi = new Array<number>(m).fill(0);
  for (let i = 1; i < m; i++) {
    let len = pi[i - 1]!;
    while (len > 0 && pat[len] !== pat[i]) len = pi[len - 1]!;
    if (pat[len] === pat[i]) len++;
    pi[i] = len;
  }
  // 转移表：trans[q] = { ch -> nextQ }
  const trans: Record<string, number>[] = [];
  for (let q = 0; q <= m; q++) trans.push({});
  for (let q = 0; q <= m; q++) {
    for (const ch of alphabet) {
      let nextQ = q;
      if (q < m && pat[q] === ch) {
        nextQ = q + 1;
      } else if (q > 0) {
        nextQ = trans[pi[q - 1]!]![ch]!;
      } else {
        nextQ = 0;
      }
      trans[q]![ch] = nextQ;
      if (q <= m) hooks.onBuildTrans?.(q, ch, nextQ);
    }
  }
  return trans;
}

/**
 * 用匹配自动机扫描文本，返回所有匹配的结束下标。
 *
 * 状态 q=m 时即命中（结束于 i）。
 * 时间 O(n)，空间 O(1)（不含转移表）。
 *
 * @returns 所有匹配结束下标（升序）
 */
export function searchWithAutomaton(
  text: string,
  trans: Record<string, number>[],
  m: number,
  hooks: StringMatchAutomatonHooks = {},
): number[] {
  const result: number[] = [];
  let q = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const nextQ = trans[q]![ch] ?? 0;
    hooks.onTransfer?.(i, q, nextQ, ch);
    q = nextQ;
    if (q === m) {
      hooks.onFound?.(i);
      result.push(i);
    }
  }
  return result;
}

/**
 * 便捷：构造自动机并搜索，返回所有匹配起点下标。
 */
export function stringMatchAutomaton(
  text: string,
  pat: string,
  hooks: StringMatchAutomatonHooks = {},
): number[] {
  const m = pat.length;
  if (m === 0 || m > text.length) return [];
  // 字母表 = text ∪ pat 中出现的字符
  const alpha = Array.from(new Set([...text, ...pat])).join('');
  const trans = buildMatchAutomaton(pat, alpha, hooks);
  const ends = searchWithAutomaton(text, trans, m, hooks);
  return ends.map((i) => i - m + 1);
}
