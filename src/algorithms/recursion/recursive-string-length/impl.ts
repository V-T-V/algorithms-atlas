// 递归求字符串长度 · 纯算法实现

/** 事件钩子。 */
export interface StrLenHooks {
  /** 处理某层（给出当前剩余字符串与深度）。 */
  onRecurse?: (remaining: string, depth: number) => void;
  /** 基线命中（字符串已空）。 */
  onBase?: (depth: number) => void;
  /** 某层返回（给出累计长度与深度）。 */
  onReturn?: (length: number, depth: number) => void;
}

/**
 * 递归求字符串长度（不使用 .length）。
 *
 * @param s 输入字符串
 * @param hooks 可选事件钩子
 * @returns 字符数
 */
export function stringLength(s: string, hooks: StrLenHooks = {}, depth: number = 0): number {
  if (s.length === 0) {
    hooks.onBase?.(depth);
    return 0;
  }
  hooks.onRecurse?.(s, depth);
  const rest = stringLength(s.slice(1), hooks, depth + 1);
  const len = 1 + rest;
  hooks.onReturn?.(len, depth);
  return len;
}
