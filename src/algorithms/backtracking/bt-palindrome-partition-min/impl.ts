// =============================================================================
// 最少回文分割 · 纯算法实现
// 回溯枚举每个回文前缀 + 记忆化（minCutsFrom[i]）+ 回文预判断表。
// =============================================================================
export interface BtPalindromePartitionMinHooks {
  onTryCut?: (start: number, end: number, isPalindrome: boolean) => void;
  onMemo?: (start: number, cuts: number) => void;
  onBestCut?: (position: number) => void;
}

function isPal(s: string, l: number, r: number): boolean {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}

export function btPalindromePartitionMin(
  s: string,
  hooks: BtPalindromePartitionMinHooks = {},
): number {
  const n = s.length;
  if (n === 0) return 0;
  const memo = new Array<number>(n + 1).fill(-1);
  memo[n] = 0; // 起点 n（末尾）不需要再切

  const cutFrom = (start: number): number => {
    if (memo[start] !== -1) return memo[start]!;
    let best = Infinity;
    for (let end = start; end < n; end++) {
      const pal = isPal(s, start, end);
      hooks.onTryCut?.(start, end, pal);
      if (pal) {
        const sub = cutFrom(end + 1);
        if (sub !== Infinity) {
          const cuts = start === 0 ? sub : 1 + sub;
          if (cuts < best) best = cuts;
        }
      }
    }
    memo[start] = best;
    hooks.onMemo?.(start, best);
    return best;
  };

  const result = cutFrom(0);
  return result === Infinity ? -1 : result;
}

/** 返回最少分割后的回文子串列表（用于校验）。 */
export function btPalindromePartitionMinList(s: string): string[] {
  const n = s.length;
  if (n === 0) return [];
  const memo = new Array<number>(n + 1).fill(-1);
  const next = new Array<number>(n).fill(n);
  memo[n] = 0;
  const cutFrom = (start: number): number => {
    if (memo[start] !== -1) return memo[start]!;
    let best = Infinity;
    for (let end = start; end < n; end++) {
      if (isPal(s, start, end)) {
        const sub = cutFrom(end + 1);
        if (sub !== Infinity) {
          const cuts = start === 0 ? sub : 1 + sub;
          if (cuts < best) {
            best = cuts;
            next[start] = end + 1;
          }
        }
      }
    }
    memo[start] = best;
    return best;
  };
  cutFrom(0);
  const parts: string[] = [];
  let i = 0;
  while (i < n) {
    parts.push(s.slice(i, next[i]!));
    i = next[i]!;
  }
  return parts;
}
