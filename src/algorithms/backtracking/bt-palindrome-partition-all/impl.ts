// =============================================================================
// 所有回文分割 · 纯算法实现
// =============================================================================
export interface BtPalindromePartitionAllHooks {
  onCut?: (start: number, end: number, isPalindrome: boolean) => void;
  onEmit?: (parts: string[]) => void;
}

function isPal(s: string, l: number, r: number): boolean {
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++;
    r--;
  }
  return true;
}

export function btPalindromePartitionAll(
  s: string,
  hooks: BtPalindromePartitionAllHooks = {},
): string[][] {
  const result: string[][] = [];
  const path: string[] = [];

  const dfs = (start: number): void => {
    if (start === s.length) {
      const snap = [...path];
      result.push(snap);
      hooks.onEmit?.(snap);
      return;
    }
    for (let end = start; end < s.length; end++) {
      const pal = isPal(s, start, end);
      hooks.onCut?.(start, end, pal);
      if (pal) {
        path.push(s.slice(start, end + 1));
        dfs(end + 1);
        path.pop();
      }
    }
  };

  dfs(0);
  return result;
}
