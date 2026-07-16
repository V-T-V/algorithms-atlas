// =============================================================================
// 朴素匹配 Naive String Match · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NaiveMatchHooks {
  /** 把模式串对齐到文本起点 s（本次窗口起点）。 */
  onAlign?: (s: number) => void;
  /** 比较文本下标 i 与模式下标 j 的字符。返回 equal 表示是否相等。 */
  onCompare?: (i: number, j: number, equal: boolean) => void;
  /** 在窗口起点 s 处失配（j < m）。 */
  onMismatch?: (s: number, j: number) => void;
  /** 在文本下标 s 处完整匹配到模式（起点）。 */
  onFound?: (s: number) => void;
}

/**
 * 朴素字符串匹配：在 `text` 中找出所有 `pat` 出现的起点下标。
 *
 * - 对每个起点 `s ∈ [0, n-m]`，逐字符比对 `text[s+j]` 与 `pat[j]`
 * - 一旦不等就跳出，把窗口整体右移一位继续
 * - 全部 `m` 个字符都相等 → 命中一次
 *
 * 时间 `O(n·m)`，空间 `O(1)`（结果数组不计）。空模式 / `m > n` 返回 `[]`。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function naiveMatch(text: string, pat: string, hooks: NaiveMatchHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const result: number[] = [];
  for (let s = 0; s <= n - m; s++) {
    hooks.onAlign?.(s);
    let j = 0;
    while (j < m) {
      const equal = text[s + j] === pat[j];
      hooks.onCompare?.(s + j, j, equal);
      if (!equal) break;
      j++;
    }
    if (j === m) {
      result.push(s);
      hooks.onFound?.(s);
    } else {
      hooks.onMismatch?.(s, j);
    }
  }
  return result;
}
