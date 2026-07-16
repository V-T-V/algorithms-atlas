// =============================================================================
// 贴纸拼词 · 纯算法实现 (LeetCode 691 简化版)
// 用字符计数 + 记忆化（target 子串的 key）求最少贴纸数。
// =============================================================================
export interface BtStickersSpellHooks {
  onApply?: (stickerIndex: number, remaining: number) => void;
  onMemo?: (state: string, count: number) => void;
}

const A = 97;

function toCount(s: string): number[] {
  const c = new Array<number>(26).fill(0);
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code >= A && code < A + 26) c[code - A]!++;
  }
  return c;
}

function countKey(c: number[]): string {
  return c.join(',');
}

export function btStickersSpell(
  stickers: readonly string[],
  target: string,
  hooks: BtStickersSpellHooks = {},
): number {
  const stickerCounts = stickers.map(toCount);
  const targetCount = toCount(target);
  const memo = new Map<string, number>();

  const dfs = (remain: number[]): number => {
    if (remain.every((c) => c === 0)) return 0;
    const key = countKey(remain);
    if (memo.has(key)) return memo.get(key)!;

    // 找出第一个仍缺的字母，强制本步必须由某张贴纸提供（避免顺序爆炸）
    let first = -1;
    for (let i = 0; i < 26; i++) {
      if (remain[i]! > 0) {
        first = i;
        break;
      }
    }
    let best = Infinity;
    for (let si = 0; si < stickerCounts.length; si++) {
      const sc = stickerCounts[si]!;
      if (sc[first] === 0) continue; // 该贴纸不提供所需字母
      const next = [...remain];
      for (let i = 0; i < 26; i++) {
        const take = Math.min(next[i]!, sc[i]!);
        next[i] = next[i]! - take;
      }
      hooks.onApply?.(
        si,
        next.reduce((a, b) => a + b, 0),
      );
      const sub = dfs(next);
      if (sub !== Infinity) best = Math.min(best, 1 + sub);
    }
    memo.set(key, best);
    hooks.onMemo?.(key, best);
    return best;
  };

  const res = dfs(targetCount);
  return res === Infinity ? -1 : res;
}
