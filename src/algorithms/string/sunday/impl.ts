// =============================================================================
// Sunday 匹配 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SundayHooks {
  /** 模式对齐到文本起点 pos。 */
  onAlign?: (pos: number) => void;
  /** 从左向右比较模式下标 j 与文本下标 ti。 */
  onCompare?: (j: number, ti: number, eq: boolean) => void;
  /** 按窗口后一字符从 oldPos 滑到 newPos。 */
  onShift?: (oldPos: number, newPos: number, nextChar: string) => void;
  /** 命中一次完整匹配（起点）。 */
  onFound?: (start: number) => void;
}

const ALPHABET = 256;

/**
 * 构造 Sunday 位移表：shift[ch] = m - (ch 在 pat 中最右出现位置)。
 * 即窗口紧邻的下一字符若在模式中出现，则把该字符对齐到模式的同字符。
 */
export function buildSundayShift(pat: string): number[] {
  const m = pat.length;
  const table = new Array<number>(ALPHABET).fill(m + 1);
  for (let i = 0; i < m; i++) table[pat.charCodeAt(i)] = m - i;
  return table;
}

/**
 * Sunday 匹配：在 text 中找出所有 pat 出现的起点下标。
 *
 * - 模式左对齐 pos，从左向右比较；失配后看 text[pos+m]（窗口后一字符）查表滑动
 * - 若该字符在模式中，则对齐；否则直接跳过 m+1 位
 *
 * 平均接近 O(n/m)，最坏 O(n·m)。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function sunday(text: string, pat: string, hooks: SundayHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const shift = buildSundayShift(pat);
  const result: number[] = [];
  let pos = 0;
  hooks.onAlign?.(pos);

  while (pos <= n - m) {
    let j = 0;
    let matched = true;
    while (j < m) {
      const ti = pos + j;
      const eq = text[ti] === pat[j];
      hooks.onCompare?.(j, ti, eq);
      if (!eq) {
        matched = false;
        break;
      }
      j++;
    }
    if (matched) {
      hooks.onFound?.(pos);
      result.push(pos);
    }
    const nextChar = pos + m < n ? text[pos + m]! : '\0';
    const step = shift[nextChar.charCodeAt(0)] ?? m + 1;
    const newPos = pos + step;
    hooks.onShift?.(pos, newPos, nextChar);
    pos = newPos;
  }
  return result;
}
