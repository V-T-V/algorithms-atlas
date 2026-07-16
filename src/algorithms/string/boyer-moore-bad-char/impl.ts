// =============================================================================
// Boyer-Moore 坏字符规则 · 纯算法实现
// =============================================================================

export interface BmHooks {
  /** 对齐起点 s（模式左端在 text 中的位置）。 */
  onAlign?: (s: number) => void;
  /** 从右向左比较 text[s+j] 与 pat[j]。 */
  onCompare?: (s: number, j: number, eq: boolean) => void;
  /** 命中。 */
  onFound?: (pos: number) => void;
  /** 根据坏字符平移。 */
  onShift?: (oldAlign: number, badChar: string, shift: number) => void;
}

/** 构建坏字符表：badChar[c] = c 在 pat 中最右出现位置，未出现则 -1。 */
export function buildBadCharTable(pat: string): Map<string, number> {
  const table = new Map<string, number>();
  for (let i = 0; i < pat.length; i++) table.set(pat[i]!, i);
  return table;
}

/** Boyer-Moore 坏字符规则匹配，返回所有命中位置。 */
export function boyerMooreBadChar(text: string, pat: string, hooks: BmHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0) return [0];
  if (m > n) return [];
  const bad = buildBadCharTable(pat);
  const res: number[] = [];
  let s = 0; // 当前对齐起点
  while (s <= n - m) {
    hooks.onAlign?.(s);
    let j = m - 1;
    while (j >= 0 && pat[j] === text[s + j]) {
      hooks.onCompare?.(s, j, true);
      j--;
    }
    if (j < 0) {
      res.push(s);
      hooks.onFound?.(s);
      // 移动 1 或按坏字符表
      const nextCh = s + m < n ? text[s + m]! : '';
      const shift = 1 + (nextCh ? m - (bad.get(nextCh) ?? -1) - 1 : 0);
      s += Math.max(1, shift);
    } else {
      hooks.onCompare?.(s, j, false);
      const badCh = text[s + j]!;
      const lastPos = bad.get(badCh) ?? -1;
      const shift = Math.max(1, j - lastPos);
      hooks.onShift?.(s, badCh, shift);
      s += shift;
    }
  }
  return res;
}
