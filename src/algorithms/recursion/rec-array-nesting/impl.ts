// 数组嵌套 · 实现

export interface NestHooks {
  onVisit?: (index: number, depth: number) => void;
  onCycle?: (startIndex: number, length: number) => void;
}

/**
 * 递归找最长环。visited 标记避免重复。
 */
export function arrayNesting(nums: number[], hooks: NestHooks = {}): number {
  const n = nums.length;
  const visited = new Array<boolean>(n).fill(false);
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    // 找到从 i 出发的环
    const len = findCycleLength(i, nums, visited, hooks);
    if (len > maxLen) maxLen = len;
    hooks.onCycle?.(i, len);
  }
  return maxLen;
}

/** 从 start 出发递归走环并标记，返回环长。 */
function findCycleLength(
  start: number,
  nums: number[],
  visited: boolean[],
  hooks: NestHooks,
): number {
  let length = 0;
  let cur = start;
  const walk = (): void => {
    if (visited[cur]) return;
    visited[cur] = true;
    hooks.onVisit?.(cur, length);
    length++;
    cur = nums[cur]!;
    walk();
  };
  walk();
  return length;
}
