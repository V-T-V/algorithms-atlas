// =============================================================================
// 汉明距离 Hamming Distance · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HammingHooks {
  /** 比较第 i 位字符：equal 表示是否相等。 */
  onCompare?: (i: number, equal: boolean) => void;
  /** 发现一处差异（第 i 位不等），累计距离 +1。 */
  onDiff?: (i: number, distance: number) => void;
  /** 扫描完成，给出最终距离。 */
  onDone?: (distance: number) => void;
}

/**
 * 汉明距离：两个**等长**字符串中对应位置字符不同的总数。
 *
 * - 逐位比较 `a[i]` 与 `b[i]`，不等则计数 +1
 * - 要求两串等长；不等长抛错（距离无定义）
 *
 * 时间 `O(n)`，空间 `O(1)`。
 *
 * @returns 汉明距离（非负整数）
 */
export function hamming(a: string, b: string, hooks: HammingHooks = {}): number {
  if (a.length !== b.length) {
    throw new Error(`汉明距离要求等长字符串：得到 ${a.length} 与 ${b.length}`);
  }
  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    const equal = a[i] === b[i];
    hooks.onCompare?.(i, equal);
    if (!equal) {
      dist++;
      hooks.onDiff?.(i, dist);
    }
  }
  hooks.onDone?.(dist);
  return dist;
}
