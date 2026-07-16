// =============================================================================
// 重构字符串（Reorganize String）· 纯算法实现
// 频次降序填偶数下标再填奇数下标。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface ReorganizeStringHooks {
  /** 频次统计完成。 */
  onCount?: (freq: Array<{ ch: string; count: number }>) => void;
  /** 把字符 ch 填入下标 pos。 */
  onPlace?: (ch: string, pos: number, result: string[]) => void;
  /** 结论。 */
  onConclude?: (result: string) => void;
}

export interface ReorganizeResult {
  /** 重排结果（不可行时为空串）。 */
  value: string;
  /** 是否可行。 */
  possible: boolean;
}

/**
 * 重构字符串：使相邻字符不同（贪心）。
 *
 * @param s 源字符串
 * @param hooks 可选事件钩子
 */
export function reorganizeString(s: string, hooks: ReorganizeStringHooks = {}): ReorganizeResult {
  const n = s.length;
  if (n === 0) return { value: '', possible: true };

  // 频次统计
  const counter = new Map<string, number>();
  for (const ch of s) counter.set(ch, (counter.get(ch) ?? 0) + 1);
  const freq = [...counter.entries()]
    .map(([ch, count]) => ({ ch, count }))
    .sort((a, b) => b.count - a.count);
  hooks.onCount?.(freq);

  const maxFreq = freq[0]!.count;
  if (maxFreq > Math.floor((n + 1) / 2)) {
    hooks.onConclude?.('');
    return { value: '', possible: false };
  }

  // 填偶数下标再填奇数下标
  const result: string[] = new Array<string>(n).fill('');
  let idx = 0; // 在 freq 字符流中的指针
  let ch = freq[idx]!.ch;
  let left = freq[idx]!.count;
  for (let pass = 0; pass < 2; pass++) {
    const start = pass === 0 ? 0 : 1;
    for (let pos = start; pos < n; pos += 2) {
      while (left === 0) {
        idx++;
        ch = freq[idx]!.ch;
        left = freq[idx]!.count;
      }
      result[pos] = ch;
      left--;
      hooks.onPlace?.(ch, pos, [...result]);
    }
  }
  const value = result.join('');
  hooks.onConclude?.(value);
  return { value, possible: true };
}
