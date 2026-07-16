// 递减字符串拆分 · 实现（返回是否能拆成严格递减正整数）
export interface SplitHooks {
  onPick?: (idx: number, value: bigint) => void;
  onConclude?: (ok: boolean, pieces: bigint[]) => void;
}
export interface SplitResult {
  ok: boolean;
  pieces: bigint[];
}
export function greedySplit2(s: string, hooks: SplitHooks = {}): SplitResult {
  const n = s.length;
  const pieces: bigint[] = [];
  const dfs = (start: number, prev: bigint): boolean => {
    if (start === n) return pieces.length >= 2;
    let cur = 0n;
    for (let i = start; i < n; i++) {
      cur = cur * 10n + BigInt(s[i]!);
      if (cur > 10n ** 18n) break;
      if (pieces.length === 0) {
        pieces.push(cur);
        hooks.onPick?.(i, cur);
        if (dfs(i + 1, cur)) return true;
        pieces.pop();
      } else {
        if (cur === prev - 1n) {
          pieces.push(cur);
          hooks.onPick?.(i, cur);
          if (dfs(i + 1, cur)) return true;
          pieces.pop();
        } else if (cur >= prev) break;
      }
    }
    return false;
  };
  const ok = dfs(0, 0n);
  hooks.onConclude?.(ok, pieces);
  return { ok, pieces };
}
