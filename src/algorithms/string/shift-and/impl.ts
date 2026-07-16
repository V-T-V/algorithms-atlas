// =============================================================================
// Shift-And 匹配（位并行正向）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ShiftAndHooks {
  /** 读入文本第 i 个字符，更新后的匹配状态 state（位 i=1 表示模式前缀长度 i 已匹配）。 */
  onChar?: (i: number, ch: string, state: number) => void;
  /** 命中一次完整匹配（结束下标 i）。 */
  onFound?: (end: number) => void;
  /** 计算完成。 */
  onDone?: (starts: number[]) => void;
}

/**
 * Shift-And：位并行模拟 NFA。state 的第 k 位 = 1 表示当前文本位置能匹配模式的前 k 个字符。
 *
 * - 读入 text[i]：state = ((state << 1) | 1) & mask[text[i]]
 * - state 的第 m 位（最高有效）为 1 → 命中（结束于 i，起点 i - m + 1）
 *
 * 限制：模式长度 m <= 32（JS number）。
 * 时间 O(n)，空间 O(|Σ|)。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function shiftAnd(text: string, pat: string, hooks: ShiftAndHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  if (m > 32) return naiveMatch(text, pat);

  const mask: Record<number, number> = {};
  for (let i = 0; i < m; i++) {
    const code = pat.charCodeAt(i);
    mask[code] = (mask[code] ?? 0) | (1 << i);
  }

  const result: number[] = [];
  let state = 0;
  const hit = 1 << (m - 1);
  for (let i = 0; i < n; i++) {
    const code = text.charCodeAt(i);
    state = ((state << 1) | 1) & (mask[code] ?? 0);
    hooks.onChar?.(i, text[i]!, state);
    if ((state & hit) !== 0) {
      const start = i - m + 1;
      hooks.onFound?.(i);
      result.push(start);
    }
  }
  hooks.onDone?.(result);
  return result;
}

function naiveMatch(text: string, pat: string): number[] {
  const n = text.length;
  const m = pat.length;
  const res: number[] = [];
  for (let s = 0; s <= n - m; s++) {
    if (text.slice(s, s + m) === pat) res.push(s);
  }
  return res;
}
