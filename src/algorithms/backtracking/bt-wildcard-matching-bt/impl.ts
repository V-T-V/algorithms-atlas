// =============================================================================
// 通配符匹配回溯 · 纯算法实现
// 贪心回溯：保存最近 * 位置。
// =============================================================================
export interface BtWildcardHooks {
  onStep?: (i: number, j: number) => void;
  onStar?: (j: number) => void;
  onBack?: (i: number, j: number) => void;
}

export function btWildcardMatching(s: string, p: string, hooks: BtWildcardHooks = {}): boolean {
  let i = 0,
    j = 0;
  let starJ = -1,
    matchI = 0;
  while (i < s.length) {
    if (j < p.length && (p[j] === '?' || p[j] === s[i])) {
      hooks.onStep?.(i, j);
      i++;
      j++;
    } else if (j < p.length && p[j] === '*') {
      hooks.onStar?.(j);
      starJ = j;
      matchI = i;
      j++;
    } else if (starJ !== -1) {
      j = starJ + 1;
      matchI++;
      i = matchI;
      hooks.onBack?.(i, j);
    } else {
      return false;
    }
  }
  while (j < p.length && p[j] === '*') j++;
  return j === p.length;
}
