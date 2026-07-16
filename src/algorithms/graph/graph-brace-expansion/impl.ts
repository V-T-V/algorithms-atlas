// =============================================================================
// 花括号展开 · 纯算法实现（分块 + 笛卡尔积）
// =============================================================================

export interface BraceExpansionHooks {
  onBlock?: (idx: number, options: string[]) => void;
  onResult?: (words: string[]) => void;
}

export function expandBraces(s: string, hooks: BraceExpansionHooks = {}): string[] {
  // 解析成块
  const blocks: string[][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '{') {
      const j = s.indexOf('}', i);
      const options = s
        .slice(i + 1, j)
        .split(',')
        .sort();
      blocks.push(options);
      i = j + 1;
      hooks.onBlock?.(blocks.length - 1, options);
    } else {
      blocks.push([s[i]!]);
      hooks.onBlock?.(blocks.length - 1, [s[i]!]);
      i++;
    }
  }
  // 笛卡尔积
  let result: string[] = [''];
  for (const block of blocks) {
    const next: string[] = [];
    for (const prefix of result) {
      for (const opt of block) {
        next.push(prefix + opt);
      }
    }
    result = next;
  }
  result.sort();
  hooks.onResult?.(result);
  return result;
}
