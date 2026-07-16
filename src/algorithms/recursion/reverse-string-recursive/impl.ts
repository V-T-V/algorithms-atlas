// 递归反转字符串 · 纯算法实现

/** 事件钩子。 */
export interface ReverseStringHooks {
  /** 进入一层 reverse(s)。 */
  onRecurse?: (s: string, depth: number) => void;
  /** 基例：空串。 */
  onBase?: (depth: number) => void;
  /** 合并：reverse(rest) + first。 */
  onCombine?: (first: string, restReversed: string, result: string, depth: number) => void;
}

/**
 * 递归反转字符串。
 * reverse(s) = s.length === 0 ? s : reverse(s.slice(1)) + s[0]
 */
export function reverseString(s: string, hooks: ReverseStringHooks = {}, depth = 0): string {
  hooks.onRecurse?.(s, depth);
  if (s.length <= 1) {
    if (s.length === 0) hooks.onBase?.(depth);
    return s;
  }
  const first = s[0]!;
  const rest = s.slice(1);
  const restReversed = reverseString(rest, hooks, depth + 1);
  const result = restReversed + first;
  hooks.onCombine?.(first, restReversed, result, depth);
  return result;
}
