// =============================================================================
// 块排序 (BWT 变种) · 纯算法实现
// =============================================================================

export interface BlockSortResult {
  lastColumn: string;
  primaryIndex: number;
}

export interface BlockSortHooks {
  onBlock?: (block: string, result: BlockSortResult) => void;
}

/** 正向 BWT（单块）。 */
export function bwtForward(s: string): BlockSortResult {
  if (s.length === 0) return { lastColumn: '', primaryIndex: 0 };
  const n = s.length;
  const rotations: string[] = [];
  for (let i = 0; i < n; i++) {
    rotations.push(s.slice(i) + s.slice(0, i));
  }
  rotations.sort();
  const lastColumn = rotations.map((r) => r[n - 1]!).join('');
  const primaryIndex = rotations.indexOf(s);
  return { lastColumn, primaryIndex };
}

/** 反向 BWT（单块）。 */
export function bwtInverse(lastColumn: string, primaryIndex: number): string {
  const n = lastColumn.length;
  if (n === 0) return '';
  // 第一列 = 排序后的末列
  const firstCol = [...lastColumn].sort().join('');
  // 构造 next 数组：第一列字符在末列中的位置
  // 用「LF 映射」：对每个字符，统计出现次序
  const counts = new Map<string, number>();
  for (const c of lastColumn) counts.set(c, (counts.get(c) ?? 0) + 1);
  // 计算 firstCol 中每个字符的起始位置
  const starts = new Map<string, number>();
  let acc = 0;
  for (const c of [...counts.keys()].sort()) {
    starts.set(c, acc);
    acc += counts.get(c)!;
  }
  // rank：lastColumn 中每个字符之前同字符出现次数
  const rank: number[] = new Array(n).fill(0);
  const seen = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const c = lastColumn[i]!;
    rank[i] = seen.get(c) ?? 0;
    seen.set(c, (seen.get(c) ?? 0) + 1);
  }
  // 反向遍历重建
  const out: string[] = new Array(n);
  let pos = primaryIndex;
  for (let i = n - 1; i >= 0; i--) {
    out[i] = lastColumn[pos]!;
    const c = lastColumn[pos]!;
    pos = starts.get(c)! + rank[pos]!;
  }
  void firstCol;
  return out.join('');
}

/** 分块块排序。 */
export function blockSortForward(
  data: string,
  blockSize: number,
  hooks: BlockSortHooks = {},
): Array<BlockSortResult> {
  const results: BlockSortResult[] = [];
  for (let i = 0; i < data.length; i += blockSize) {
    const block = data.slice(i, i + blockSize);
    const r = bwtForward(block);
    results.push(r);
    hooks.onBlock?.(block, r);
  }
  return results;
}

/** 分块反向。 */
export function blockSortInverse(results: readonly BlockSortResult[]): string {
  let out = '';
  for (const r of results) out += bwtInverse(r.lastColumn, r.primaryIndex);
  return out;
}
