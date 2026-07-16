// =============================================================================
// 回文子串计数（Palindromic Substrings）· 纯算法实现
// 中心扩展法，O(n²) 时间 O(1) 空间。零 DOM 依赖，可独立单测。
// =============================================================================

export interface PalindromeSubstringsHooks {
  /** 选定一个中心（center 为 2*idx 或 2*idx+1 形式）。 */
  onCenter?: (center: number, isOdd: boolean) => void;
  /** 中心扩展成功：发现回文 [lo, hi]。 */
  onExpand?: (lo: number, hi: number) => void;
  /** 扩展结束（不匹配或越界）。 */
  onExpandEnd?: (lo: number, hi: number) => void;
}

/**
 * 统计 s 的所有回文子串个数。
 * 中心扩展：对每个中心（奇/偶）向两边扩展，每扩成功 +1。
 * 时间 O(n²)，空间 O(1)。
 */
export function countSubstrings(s: string, hooks: PalindromeSubstringsHooks = {}): number {
  const n = s.length;
  let count = 0;

  // 从中心 [left, right]（left==right 奇，left+1==right 偶）向外扩展
  const expand = (left: number, right: number): void => {
    let lo = left;
    let hi = right;
    while (lo >= 0 && hi < n && s[lo] === s[hi]) {
      count++;
      hooks.onExpand?.(lo, hi);
      lo--;
      hi++;
    }
    hooks.onExpandEnd?.(lo + 1, hi - 1);
  };

  for (let i = 0; i < n; i++) {
    // 奇数长度中心：i
    hooks.onCenter?.(i, true);
    expand(i, i);
    // 偶数长度中心：i, i+1 间隙
    if (i + 1 < n) {
      hooks.onCenter?.(i, false);
      expand(i, i + 1);
    }
  }
  return count;
}

/** 列出所有回文子串（按中心扩展发现的顺序）。便于断言。 */
export function listPalindromes(s: string): string[] {
  const out: string[] = [];
  const n = s.length;
  const expand = (left: number, right: number): void => {
    let lo = left;
    let hi = right;
    while (lo >= 0 && hi < n && s[lo] === s[hi]) {
      out.push(s.slice(lo, hi + 1));
      lo--;
      hi++;
    }
  };
  for (let i = 0; i < n; i++) {
    expand(i, i);
    if (i + 1 < n) expand(i, i + 1);
  }
  return out;
}
