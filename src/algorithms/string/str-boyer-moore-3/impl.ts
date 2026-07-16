// =============================================================================
// Boyer-Moore：坏字符规则
// =============================================================================

export interface BmHooks {
  onCompare?: (i: number, j: number, equal: boolean) => void;
  onShift?: (from: number, to: number, delta: number) => void;
  onFound?: (start: number) => void;
}

/** 构建坏字符表：字符 -> 模式中最右出现位置。 */
function buildBadChar(pat: string): Map<string, number> {
  const table = new Map<string, number>();
  for (let i = 0; i < pat.length; i++) table.set(pat[i]!, i);
  return table;
}

export function boyerMoore(text: string, pat: string, hooks: BmHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  const badChar = buildBadChar(pat);
  const result: number[] = [];
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0) {
      const equal = pat[j] === text[s + j];
      hooks.onCompare?.(s + j, j, equal);
      if (!equal) break;
      j--;
    }
    if (j < 0) {
      hooks.onFound?.(s);
      result.push(s);
      // 整体右移一位继续找重叠
      const next = s + 1;
      hooks.onShift?.(s, next, 1);
      s = next;
    } else {
      const c = text[s + j]!;
      const lastInPat = badChar.get(c) ?? -1;
      const delta = Math.max(1, j - lastInPat);
      hooks.onShift?.(s, s + delta, delta);
      s += delta;
    }
  }
  return result;
}
