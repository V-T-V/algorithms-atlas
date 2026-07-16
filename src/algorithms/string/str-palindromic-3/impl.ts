// =============================================================================
// 回文子串计数 DP
// =============================================================================

export interface PalindromicHooks {
  onCell?: (i: number, j: number, isPal: boolean) => void;
  onFound?: (l: number, r: number) => void;
  onDone?: (total: number) => void;
}

export interface PalindromicResult {
  total: number;
  isPal: boolean[][];
}

export function countPalindromes(s: string, hooks: PalindromicHooks = {}): PalindromicResult {
  const n = s.length;
  if (n === 0) return { total: 0, isPal: [] };
  const isPal: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  let total = 0;
  // 长度 1
  for (let i = 0; i < n; i++) {
    isPal[i]![i] = true;
    total++;
    hooks.onCell?.(i, i, true);
    hooks.onFound?.(i, i);
  }
  // 长度 2
  for (let i = 0; i + 1 < n; i++) {
    if (s[i] === s[i + 1]) {
      isPal[i]![i + 1] = true;
      total++;
      hooks.onCell?.(i, i + 1, true);
      hooks.onFound?.(i, i + 1);
    }
  }
  // 长度 >= 3
  for (let len = 3; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const v = s[i] === s[j] && isPal[i + 1]![j - 1]!;
      isPal[i]![j] = v;
      hooks.onCell?.(i, j, v);
      if (v) {
        total++;
        hooks.onFound?.(i, j);
      }
    }
  }
  hooks.onDone?.(total);
  return { total, isPal };
}
