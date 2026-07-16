// =============================================================================
// 最长公共前缀 LCP Array（后缀数组 LCP，Kasai 算法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 核心：给定已排序后缀数组 SA，O(n) 求相邻后缀的 LCP 数组（Kasai 的单调性 = 一种 DP）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LcpArrayHooks {
  /** 处理原串下标 i（按位置从左到右），其排名为 rank[i]。 */
  onVisit?: (i: number, rank: number, h: number) => void;
  /** 已确定 lcp[rank[i]] = h（相邻后缀 SA[rank[i]-1] 与 SA[rank[i]] 的最长公共前缀）。 */
  onFillCell?: (rank: number, h: number) => void;
  /** 算法完成。 */
  onDone?: (lcp: number[], maxLcp: number) => void;
}

/**
 * 构建后缀数组 SA：对串 `s` 的所有后缀按字典序升序排列，返回它们在原串中的起始下标。
 * 简单实现 O(n² log n)（适用于演示规模）；生产用 SA-IS 可 O(n)。
 *
 * @param s 原串
 * @returns SA（长度 n），SA[k] = 第 k 小后缀的起始下标
 */
export function buildSuffixArray(s: string): number[] {
  const n = s.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => {
    const sa = s.slice(a);
    const sb = s.slice(b);
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  });
  return idx;
}

/**
 * Kasai 算法（O(n) DP）：给定串 `s` 与其后缀数组 `sa`，求 LCP 数组。
 *
 * `lcp[k]` = `s` 的第 k-1 小与第 k 小后缀的最长公共前缀长度；`lcp[0] = 0`。
 *
 * 单调性（DP 递推）：设 `h = lcp[rank[i-1]]`，则 `lcp[rank[i]] ≥ h - 1`（去掉首字符后仍有序）。
 * 因此从位置 `i=0..n-1` 顺序扫描，维护 `h`，每次从 `h` 起比较而**不归零**，总比较数 ≤ 2n。
 *
 * @param s 原串
 * @param sa 后缀数组（默认内部用 buildSuffixArray 计算）
 * @param hooks 可选事件钩子
 * @returns LCP 数组（长度 n，lcp[0]=0）
 */
export function longestCommonPrefix(
  s: string,
  sa: number[] = buildSuffixArray(s),
  hooks: LcpArrayHooks = {},
): number[] {
  const n = s.length;
  const lcp = new Array<number>(n).fill(0);
  if (n === 0) {
    hooks.onDone?.([], 0);
    return [];
  }

  // rank[i] = 后缀 i 在 sa 中的位次
  const rank = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) rank[sa[k]!] = k;

  let h = 0;
  let maxLcp = 0;
  for (let i = 0; i < n; i++) {
    const r = rank[i]!;
    if (r === 0) {
      // 排名第 0 的后缀无前驱，lcp[0] = 0
      hooks.onVisit?.(i, r, 0);
      continue;
    }
    const j = sa[r - 1]!; // 前驱后缀起点
    // 从 h 起比较（不归零，依赖单调性）
    while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
    lcp[r] = h;
    if (h > maxLcp) maxLcp = h;
    hooks.onVisit?.(i, r, h);
    hooks.onFillCell?.(r, h);
    if (h > 0) h--; // 单调性：下一位置至少 h-1
  }

  hooks.onDone?.(lcp, maxLcp);
  return lcp;
}
