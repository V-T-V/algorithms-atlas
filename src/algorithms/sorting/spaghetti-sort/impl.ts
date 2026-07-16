// =============================================================================
// 意大利面排序 Spaghetti Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SpaghettiSortHooks {
  /** 「放下一根长度为 length 的意大利面」。 */
  onPlaceRod?: (length: number, idx: number) => void;
  /** 「手往下压」拿到当前最长的一根（长度 = h），idx 为它在结果中的位置。 */
  onPickRod?: (length: number, idx: number) => void;
}

/**
 * 意大利面排序（Spaghetti Sort）。
 *
 * 原理：一种**线性时间**（在 RAM / 指针机器假设失效的「真实并行」模型下）的排序，
 * 类比物理操作：
 * - 把每个数值映射成一根对应**长度**的意大利面条
 * - 把它们竖直立在桌上，用手水平向下压——最先顶到手的总是最长的那根
 * - 取走最长的一根，记录到输出末尾；重复直到取完
 *
 * 离散实现等价于：用计数数组统计每个长度出现次数，然后从大到小回收。
 * 仅适用于**非负整数**。
 *
 * - 时间 `O(n + range)`（range = max − min）
 * - 空间 `O(range)`
 *
 * @param arr 非负整数数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function spaghettiSort(arr: readonly number[], hooks: SpaghettiSortHooks = {}): number[] {
  const n = arr.length;
  if (n <= 1) return [...arr];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (min < 0) throw new RangeError('spaghettiSort: only supports non-negative integers');

  const range = max - min + 1;
  const count = new Array<number>(range).fill(0);

  // 放下每根面条
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    count[v - min]! += 1;
    hooks.onPlaceRod?.(v, i);
  }

  // 从最长到最短回收（手向下压）。先挑出的（最长）应排在结果末尾，
  // 因此按「从尾往前」填入 out。
  const out: number[] = new Array(n);
  let writePos = n - 1;
  for (let len = range - 1; len >= 0; len--) {
    while (count[len]! > 0) {
      const v = len + min;
      out[writePos] = v;
      hooks.onPickRod?.(v, writePos);
      writePos--;
      count[len]! -= 1;
    }
  }
  return out;
}
