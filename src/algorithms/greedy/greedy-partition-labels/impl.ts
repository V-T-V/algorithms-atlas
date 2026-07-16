// =============================================================================
// 划分字母区间 · 纯算法实现 (LeetCode 763)
// =============================================================================
export interface GreedyPartitionLabelsHooks {
  onExtend?: (right: number, ch: string) => void;
  onCut?: (start: number, end: number, size: number) => void;
  onConclude?: (sizes: number[]) => void;
}

export function greedyPartitionLabels(s: string, hooks: GreedyPartitionLabelsHooks = {}): number[] {
  // 记录每个字母最后出现位置
  const last = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    last.set(s[i]!, i);
  }

  const sizes: number[] = [];
  let start = 0;
  let right = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    const lastPos = last.get(ch)!;
    if (lastPos > right) {
      right = lastPos;
      hooks.onExtend?.(right, ch);
    }
    if (i === right) {
      const size = right - start + 1;
      sizes.push(size);
      hooks.onCut?.(start, right, size);
      start = i + 1;
    }
  }
  hooks.onConclude?.(sizes);
  return sizes;
}
