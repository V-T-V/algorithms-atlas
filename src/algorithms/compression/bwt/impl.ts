// =============================================================================
// Burrows-Wheeler变换（BWT）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BwtHooks {
  onSort?: (rotations: string[]) => void;
  onResult?: (last: string, primary: number) => void;
}

export interface BwtResult {
  /** 变换后的最后一列字符串。 */
  lastColumn: string;
  /** 原串在排序轮转矩阵中的行号（主索引）。 */
  primary: number;
}

/**
 * Burrows-Wheeler 变换：对字符串的所有循环轮转排序，取最后一列。
 * 便于后续 MTF + 熵编码（bzip2 系）。
 * @param s 输入字符串
 * @param end 结束符（默认无）
 * @param hooks 可选的事件钩子
 */
export function bwt(s: string, end = '', hooks: BwtHooks = {}): BwtResult {
  const text = end ? s + end : s;
  const n = text.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => {
    for (let k = 0; k < n; k++) {
      const ca = text[(a + k) % n]!;
      const cb = text[(b + k) % n]!;
      if (ca !== cb) return ca < cb ? -1 : 1;
    }
    return 0;
  });
  hooks.onSort?.(indices.map((i) => text.slice(i) + text.slice(0, i)));

  let last = '';
  let primary = 0;
  for (let r = 0; r < n; r++) {
    last += text[(indices[r]! + n - 1) % n]!;
    if (indices[r] === 0) primary = r;
  }
  hooks.onResult?.(last, primary);
  return { lastColumn: last, primary };
}

/** BWT 逆变换：根据最后一列与主索引还原原串（LF-mapping）。 */
export function inverseBwt(lastColumn: string, primary: number): string {
  const n = lastColumn.length;
  if (n === 0) return '';
  // 对 L 列稳定排序得到 F 列，记录 F 列每个位置对应的原 L 下标
  const pairs = Array.from(lastColumn).map((c, i) => ({ c, i }));
  pairs.sort((a, b) => (a.c < b.c ? -1 : a.c > b.c ? 1 : a.i - b.i));
  const next = pairs.map((p) => p.i);
  // 从 primary 行出发，沿 LF 链逐字符还原原串
  let result = '';
  let idx = primary;
  for (let k = 0; k < n; k++) {
    idx = next[idx]!;
    result += lastColumn[idx]!;
  }
  return result;
}
