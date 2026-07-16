// 嵌套列表权重和 II · 实现

export type NestedItem = number | NestedItem[];

export interface Nest2Hooks {
  onInteger?: (value: number, depth: number, weight: number) => void;
}

/** 递归求最大深度。 */
export function findMaxDepth(list: NestedItem[]): number {
  let d = 1;
  for (const item of list) {
    if (Array.isArray(item)) d = Math.max(d, 1 + findMaxDepth(item));
  }
  return d;
}

/** 递归求反向深度权重和。 */
export function depthSumInverse(list: NestedItem[], hooks: Nest2Hooks = {}): number {
  const maxD = findMaxDepth(list);
  return sumWithWeight(list, maxD, maxD, hooks);
}

function sumWithWeight(list: NestedItem[], depth: number, maxD: number, hooks: Nest2Hooks): number {
  // 反向权重 = depth（最深层 depth=1，越浅 depth 越大）；这里 depth 直接作为权重
  let sum = 0;
  for (const item of list) {
    if (typeof item === 'number') {
      sum += item * depth;
      hooks.onInteger?.(item, maxD - depth + 1, depth);
    } else {
      sum += sumWithWeight(item, depth - 1, maxD, hooks);
    }
  }
  return sum;
}
