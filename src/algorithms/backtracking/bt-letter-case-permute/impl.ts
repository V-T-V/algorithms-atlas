// =============================================================================
// 字母大小写全排列 · 纯算法实现 (LeetCode 784)
// 每个字母有两种选择（小写/大写），数字固定。
// =============================================================================
export interface BtLetterCasePermuteHooks {
  onChoice?: (index: number, ch: string) => void;
  onResult?: (s: string) => void;
}

export function btLetterCasePermute(s: string, hooks: BtLetterCasePermuteHooks = {}): string[] {
  const result: string[] = [];
  const chars = Array.from(s);

  const backtrack = (i: number): void => {
    if (i === chars.length) {
      const out = chars.join('');
      result.push(out);
      hooks.onResult?.(out);
      return;
    }
    const ch = chars[i]!;
    if (/[a-zA-Z]/.test(ch)) {
      chars[i] = ch.toLowerCase();
      hooks.onChoice?.(i, chars[i]!);
      backtrack(i + 1);
      chars[i] = ch.toUpperCase();
      hooks.onChoice?.(i, chars[i]!);
      backtrack(i + 1);
      chars[i] = ch; // 恢复
    } else {
      backtrack(i + 1);
    }
  };

  backtrack(0);
  return result;
}
