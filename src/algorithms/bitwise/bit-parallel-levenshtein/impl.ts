// =============================================================================
// 位并行 Levenshtein 距离 (Myers) · 纯算法实现
// 模式串长度 <= 32 时用单字实现。基于 Myers 1999 / Hyyrö 的经典位向量公式。
// =============================================================================

const WORD_BITS = 32;

export interface MyersHooks {
  onChar?: (textIndex: number, textChar: string, score: number) => void;
  onPeq?: (char: string, peq: number) => void;
}

/**
 * 用 Myers 位并行算法计算模式串 pattern 与文本 text 的 Levenshtein 编辑距离。
 * 要求 |pattern| <= 32（一个 32 位字）。|pattern|==0 时返回 |text|。
 *
 * 核心递推（每位用一对 (Pv,Mv) 编码该列差分）：
 *   Eq  = Peq[text[j]]
 *   Xv  = Eq | Mv
 *   D0  = (((Eq & Pv) + Pv) ^ Pv) | Eq | Mv
 *   Ph  = Mv | ~(D0 | Pv)        （正水平差量）
 *   Mh  = Pv & D0                （负水平差量）
 *   Score += (Ph >> (m-1)) & 1
 *   Score -= (Mh >> (m-1)) & 1
 *   Ph = (Ph << 1) | 1 ;  Mh = (Mh << 1)
 *   Pv = Mh | ~(Xv | Ph)
 *   Mv = Ph & Xv
 */
export function bitParallelLevenshtein(
  pattern: string,
  text: string,
  hooks: MyersHooks = {},
): number {
  const m = pattern.length;
  const n = text.length;
  if (m === 0) return n;
  if (m > WORD_BITS) {
    throw new RangeError(`模式串长度需 <= ${WORD_BITS}，收到 ${m}`);
  }

  // 预处理 Peq：P 中字符 ch 在位 i 置 1
  const peq = new Map<string, number>();
  for (let i = 0; i < m; i++) {
    const ch = pattern[i]!;
    peq.set(ch, ((peq.get(ch) ?? 0) | (1 << i)) >>> 0);
  }
  for (const [ch, v] of peq) hooks.onPeq?.(ch, v);

  // 初始：前 m 位全 1
  let pv = -1 >>> (WORD_BITS - m);
  let mv = 0;
  let score = m;

  for (let j = 0; j < n; j++) {
    const eq = (peq.get(text[j]!) ?? 0) >>> 0;
    const xv = (eq | mv) >>> 0;
    const d0 = ((((eq & pv) + pv) ^ pv) | eq | mv) >>> 0;
    let ph = (mv | ~(d0 | pv)) >>> 0; // 正水平差量
    let mh = (pv & d0) >>> 0; // 负水平差量

    score += ((ph >>> (m - 1)) & 1) - ((mh >>> (m - 1)) & 1);

    // 左移并补 Ph 的最低位为 1
    ph = ((ph << 1) | 1) >>> 0;
    mh = (mh << 1) >>> 0;

    // 更新 Pv / Mv
    pv = (mh | ~(xv | ph)) >>> 0;
    mv = (ph & xv) >>> 0;

    hooks.onChar?.(j, text[j]!, score);
  }

  return score;
}

/** 经典 O(mn) DP 版 Levenshtein，用于校验。 */
export function levenshteinDP(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array<number>(n + 1);
  const cur = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = cur[j]!;
  }
  return prev[n]!;
}
