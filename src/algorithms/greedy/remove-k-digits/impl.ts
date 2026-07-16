// =============================================================================
// 删除k个数字后的最小值（Remove K Digits）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RemoveKDigitsHooks {
  onPop?: (ch: string) => void;
  onPush?: (ch: string) => void;
  onResult?: (res: string) => void;
}

export interface RemoveKDigitsResult {
  /** 删除 k 个数字后能得到的「最小」数字字符串。 */
  value: string;
}

/**
 * 删除 k 个数字后的最小值（LeetCode 402）：
 *
 * 贪心 + 单调栈：从左到右扫描，若当前位比栈顶小且还能删，就弹出栈顶（删掉）。
 * 最后去掉前导 0；若仍超长，截断尾部。
 * @param num 数字字符串
 * @param k 最多删除个数
 * @param hooks 可选的事件钩子
 */
export function removeKDigits(
  num: string,
  k: number,
  hooks: RemoveKDigitsHooks = {},
): RemoveKDigitsResult {
  const stack: string[] = [];
  let removed = 0;
  for (const ch of num) {
    while (removed < k && stack.length > 0 && stack[stack.length - 1]! > ch) {
      hooks.onPop?.(stack[stack.length - 1]!);
      stack.pop();
      removed++;
    }
    stack.push(ch);
    hooks.onPush?.(ch);
  }
  // 若还没删够，删尾部
  while (removed < k && stack.length > 0) {
    hooks.onPop?.(stack[stack.length - 1]!);
    stack.pop();
    removed++;
  }
  const value = stack.join('').replace(/^0+/, '') || '0';
  hooks.onResult?.(value);
  return { value };
}
