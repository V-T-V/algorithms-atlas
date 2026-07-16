// =============================================================================
// 后缀数组（倍增构造 + Kasai 算法求 height）
// =============================================================================

export interface SAHooks {
  onRound?: (round: number, sa: number[]) => void;
  onRank?: (sa: number[]) => void;
  onHeight?: (i: number, h: number) => void;
  onDone?: (sa: number[], height: number[]) => void;
}

export interface SAResult {
  sa: number[];
  rank: number[];
  height: number[];
}

export function buildSuffixArray(s: string, hooks: SAHooks = {}): SAResult {
  const n = s.length;
  if (n === 0) return { sa: [], rank: [], height: [] };
  const sa = new Array<number>(n).fill(0).map((_, i) => i);
  const rank = new Array<number>(n).fill(0);
  const tmp = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) rank[i] = s.charCodeAt(i);

  for (let k = 1; ; k <<= 1) {
    const cmp = (a: number, b: number): number => {
      if (rank[a] !== rank[b]) return rank[a]! - rank[b]!;
      const ra = a + k < n ? rank[a + k]! : -1;
      const rb = b + k < n ? rank[b + k]! : -1;
      return ra - rb;
    };
    sa.sort(cmp);
    hooks.onRound?.(Math.log2(k) | 0, sa.slice());
    tmp[sa[0]!] = 0;
    for (let i = 1; i < n; i++) {
      tmp[sa[i]!] = tmp[sa[i - 1]!]! + (cmp(sa[i - 1]!, sa[i]!) < 0 ? 1 : 0);
    }
    for (let i = 0; i < n; i++) rank[i] = tmp[i]!;
    if (rank[sa[n - 1]!] === n - 1) break;
    hooks.onRank?.(sa.slice());
    if (k >= n) break;
  }

  // Kasai 求 height
  const height = new Array<number>(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i]! > 0) {
      const j = sa[rank[i]! - 1]!;
      while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
      height[rank[i]!] = h;
      hooks.onHeight?.(rank[i]!, h);
      if (h > 0) h--;
    } else {
      h = 0;
    }
  }
  hooks.onDone?.(sa, height);
  return { sa, rank, height };
}
