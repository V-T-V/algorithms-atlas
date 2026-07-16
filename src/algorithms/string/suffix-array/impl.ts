// =============================================================================
// 后缀数组 Suffix Array · 纯算法实现（倍增构造，O(n log^2 n)）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SuffixArrayHooks {
  /** 进入第 k 轮倍增（当前已比较长度 len = 2^k 的前缀）。 */
  onRound?: (k: number, len: number) => void;
  /** 一轮排序后，给出当前的 SA 与 rank（rank[i] = 后缀 i 的名次，0-based）。 */
  onSort?: (sa: number[], rank: number[]) => void;
  /** 所有名次都互不相同，构造完成。 */
  onDone?: (sa: number[], rank: number[]) => void;
}

/**
 * 倍增构造后缀数组。
 *
 * 思想（Manber–Myers）：先用单字符排名初始化 `rank[i]`，然后倍增长度 `len = 1, 2, 4, …`：
 * 每轮把每个后缀的关键字视为 `(rank[i], rank[i+len])`（越界取 −1），按这对二元组排序得到
 * 新的 SA 与新 rank；直到所有 rank 互不相同为止。\n
 *
 * 这里用 `(rank[i], rank[i+len])` 直接 `sort` 比较，复杂度 `O(n log^2 n)`（如需 `O(n log n)`
 * 可换基数排序）。\n
 *
 * @param s 输入字符串
 * @returns `{ sa, rank }`：sa[r] = 第 r 小的后缀起点；rank[i] = 后缀 i 的名次
 */
export function suffixArray(
  s: string,
  hooks: SuffixArrayHooks = {},
): {
  sa: number[];
  rank: number[];
} {
  const n = s.length;
  if (n === 0) {
    return { sa: [], rank: [] };
  }

  // 初始 rank：按字符码
  let rank = new Array<number>(n);
  for (let i = 0; i < n; i++) rank[i] = s.charCodeAt(i);
  // sa 初始：按 rank 升序
  const sa = rank.map((_, i) => i).sort((a, b) => rank[a]! - rank[b]!);

  let k = 0;
  for (let len = 1; ; len <<= 1) {
    hooks.onRound?.(k, len);
    // 二元组排序关键字：(rank[i], rank[i+len] or -1)
    const key = (i: number): [number, number] => [rank[i]!, i + len < n ? rank[i + len]! : -1];
    sa.sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      return ka[0] !== kb[0] ? ka[0] - kb[0] : ka[1] - kb[1];
    });

    // 重新计算 rank：相邻同 key 的后缀共享同一 rank，编号紧凑递增
    const newRank = new Array<number>(n).fill(0);
    newRank[sa[0]!] = 0;
    let r = 0;
    for (let i = 1; i < n; i++) {
      const same = key(sa[i]!)[0] === key(sa[i - 1]!)[0] && key(sa[i]!)[1] === key(sa[i - 1]!)[1];
      if (!same) r++;
      newRank[sa[i]!] = r;
    }
    rank = newRank;
    hooks.onSort?.([...sa], [...rank]);

    // 最大名次 = n-1 说明所有后缀互异，完成
    if (r === n - 1) break;
    k++;
    if (len >= n) break; // 安全保护
  }

  hooks.onDone?.(sa, rank);
  return { sa, rank };
}

/**
 * 由 SA 反算 height 数组（LCP 数组，Kasai 算法），`height[r]` = `sa[r-1]` 与 `sa[r]`
 * 两个相邻后缀的最长公共前缀长度。`O(n)`。
 */
export function buildHeight(s: string, sa: number[], rank: number[]): number[] {
  const n = sa.length;
  const height = new Array<number>(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {
    const r = rank[i]!;
    if (r === 0) {
      h = 0;
      continue;
    }
    const j = sa[r - 1]!;
    while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
    height[r] = h;
    if (h > 0) h--;
  }
  return height;
}
