// 嵌套列表权重和 · 实现

export type NestedItem = number | NestedItem[];

export interface NestHooks {
  onInteger?: (value: number, depth: number) => void;
}

/** 递归求深度权重和。 */
export function depthSum(list: NestedItem[], depth = 1, hooks: NestHooks = {}): number {
  let sum = 0;
  for (const item of list) {
    if (typeof item === 'number') {
      sum += item * depth;
      hooks.onInteger?.(item, depth);
    } else {
      sum += depthSum(item, depth + 1, hooks);
    }
  }
  return sum;
}

/** 计算最大深度。 */
export function maxDepth(list: NestedItem[]): number {
  let d = 1;
  for (const item of list) {
    if (Array.isArray(item)) d = Math.max(d, 1 + maxDepth(item));
  }
  return d;
}
