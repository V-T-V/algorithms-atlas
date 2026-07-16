// =============================================================================
// Horspool 匹配（坏字符表数组版）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Horspool2Hooks {
  /** 模式对齐到文本起点 pos。 */
  onAlign?: (pos: number) => void;
  /** 从右向左比较模式下标 j 与文本下标 ti。 */
  onCompare?: (j: number, ti: number, eq: boolean) => void;
  /** 按坏字符表从 oldPos 滑到 newPos。 */
  onShift?: (oldPos: number, newPos: number, badChar: string) => void;
  /** 命中一次完整匹配（起点）。 */
  onFound?: (start: number) => void;
}

const ALPHABET = 256;

/**
 * 构造坏字符表（数组版，按字符码索引）：shift[ch] = m - 1 - (ch 在 pat[0..m-2] 最后出现位置)，
 * 未出现则为 m。末位字符 pat[m-1] 不参与（否则可能漏匹配）。
 */
export function buildShiftTable(pat: string): number[] {
  const m = pat.length;
  const table = new Array<number>(ALPHABET).fill(m);
  for (let i = 0; i < m - 1; i++) table[pat.charCodeAt(i)] = m - 1 - i;
  return table;
}

/**
 * Horspool 匹配：在 text 中找出所有 pat 出现的起点下标。
 *
 * - 把模式对齐 pos，从右向左比较；命中或失配后，按「对齐末位文本字符」查表滑动
 * - 与 bm-horspool（Map 版）等价，这里用定长数组查表更快
 *
 * 平均 O(n/m)（次线性），最坏 O(n·m)。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function horspool2(text: string, pat: string, hooks: Horspool2Hooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const shift = buildShiftTable(pat);
  const result: number[] = [];
  let pos = 0;
  hooks.onAlign?.(pos);

  while (pos <= n - m) {
    let j = m - 1;
    let matched = true;
    while (j >= 0) {
      const ti = pos + j;
      const eq = text[ti] === pat[j];
      hooks.onCompare?.(j, ti, eq);
      if (!eq) {
        matched = false;
        break;
      }
      j--;
    }
    if (matched) {
      hooks.onFound?.(pos);
      result.push(pos);
    }
    const badChar = text[pos + m - 1]!;
    const step = shift[badChar.charCodeAt(0)] ?? m;
    const newPos = pos + step;
    hooks.onShift?.(pos, newPos, badChar);
    pos = newPos;
  }
  return result;
}
