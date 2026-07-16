// =============================================================================
// 后缀数组 + Kasai LCP · 纯算法实现
// =============================================================================

export interface SuffixArrayResult {
  sa: number[]; // 后缀数组
  rank: number[]; // rank[i] = 后缀 i 在 SA 中的位置
  height: number[]; // height[i] = LCP(SA[i-1], SA[i])；height[0]=0
}

/** 事件钩子。 */
export interface SuffixArrayKasaiHooks {
  /** SA 构造完成。 */
  onSuffixArray?: (sa: number[]) => void;
  /** Kasai 计算后缀 i 的 LCP = h。 */
  onLcp?: (i: number, h: number) => void;
  /** 完成。 */
  onDone?: (result: SuffixArrayResult) => void;
}

/**
 * 构造后缀数组与 LCP（Kasai）。
 * @param s 输入串
 */
export function suffixArrayKasai(s: string, hooks: SuffixArrayKasaiHooks = {}): SuffixArrayResult {
  const n = s.length;
  const sa = new Array<number>(n);
  for (let i = 0; i < n; i++) sa[i] = i;
  // 朴素排序：按后缀字典序
  sa.sort((a, b) => {
    let i = a;
    let j = b;
    while (i < n && j < n) {
      if (s.charCodeAt(i) !== s.charCodeAt(j)) return s.charCodeAt(i) - s.charCodeAt(j);
      i++;
      j++;
    }
    return n - i - (n - j);
  });
  hooks.onSuffixArray?.([...sa]);

  const rank = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) rank[sa[i]!] = i;

  const height = new Array<number>(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i]! > 0) {
      const j = sa[rank[i]! - 1]!; // 字典序前一名的后缀起点
      while (i + h < n && j + h < n && s.charCodeAt(i + h) === s.charCodeAt(j + h)) {
        h++;
      }
      height[rank[i]!] = h;
      hooks.onLcp?.(i, h);
      if (h > 0) h--; // 关键：下一个后缀的 LCP 至少 h-1
    } else {
      h = 0;
    }
  }
  const result: SuffixArrayResult = { sa, rank, height };
  hooks.onDone?.(result);
  return result;
}
