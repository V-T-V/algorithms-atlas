// =============================================================================
// 单词模式 II · 纯算法实现
// 回溯 + 双射。
// =============================================================================
export interface BtWordPattern2Hooks {
  onMap?: (ch: string, substr: string) => void;
  onMatch?: () => void;
}

export function btWordPattern2(
  pattern: string,
  str: string,
  hooks: BtWordPattern2Hooks = {},
): boolean {
  const p2s = new Map<string, string>();
  const s2p = new Map<string, string>();

  const dfs = (pi: number, si: number): boolean => {
    if (pi === pattern.length && si === str.length) return true;
    if (pi === pattern.length || si === str.length) return false;
    const ch = pattern[pi]!;
    if (p2s.has(ch)) {
      const mapped = p2s.get(ch)!;
      if (str.slice(si, si + mapped.length) !== mapped) return false;
      return dfs(pi + 1, si + mapped.length);
    }
    for (let end = si + 1; end <= str.length; end++) {
      const substr = str.slice(si, end);
      if (s2p.has(substr)) continue; // 双射：已被别的字母占用
      hooks.onMap?.(ch, substr);
      p2s.set(ch, substr);
      s2p.set(substr, ch);
      if (dfs(pi + 1, end)) {
        hooks.onMatch?.();
        return true;
      }
      p2s.delete(ch);
      s2p.delete(substr);
    }
    return false;
  };

  return dfs(0, 0);
}
