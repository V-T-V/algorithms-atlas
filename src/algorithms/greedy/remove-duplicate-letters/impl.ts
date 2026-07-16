// =============================================================================
// 去除重复字母（Remove Duplicate Letters）· 纯算法实现
// 单调栈：栈顶 > 当前且之后还会出现则弹出。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface RemoveDuplicateLettersHooks {
  /** 入栈字符 ch。 */
  onPush?: (ch: string, stack: string[]) => void;
  /** 弹出栈顶 ch（因为之后还会出现且更大）。 */
  onPop?: (ch: string, stack: string[]) => void;
  /** 跳过重复字符 ch。 */
  onSkip?: (ch: string) => void;
  /** 结论。 */
  onConclude?: (result: string) => void;
}

export interface RdlResult {
  /** 字典序最小的去重串。 */
  value: string;
}

/**
 * 去除重复字母：字典序最小 + 去重 + 保序（单调栈）。
 *
 * @param s 源字符串
 * @param hooks 可选事件钩子
 */
export function removeDuplicateLetters(
  s: string,
  hooks: RemoveDuplicateLettersHooks = {},
): RdlResult {
  // 每个字符最后出现下标
  const lastIdx = new Map<string, number>();
  for (let i = 0; i < s.length; i++) lastIdx.set(s[i]!, i);

  const stack: string[] = [];
  const inStack = new Set<string>();

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (inStack.has(ch)) {
      hooks.onSkip?.(ch);
      continue;
    }
    while (
      stack.length > 0 &&
      stack[stack.length - 1]! > ch &&
      lastIdx.get(stack[stack.length - 1]!)! > i
    ) {
      const top = stack.pop()!;
      inStack.delete(top);
      hooks.onPop?.(top, [...stack]);
    }
    stack.push(ch);
    inStack.add(ch);
    hooks.onPush?.(ch, [...stack]);
  }
  const value = stack.join('');
  hooks.onConclude?.(value);
  return { value };
}
