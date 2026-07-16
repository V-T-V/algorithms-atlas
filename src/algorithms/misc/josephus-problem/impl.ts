// =============================================================================
// 约瑟夫环（Josephus Problem）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface JosephusHooks {
  /** 第 round 轮（1-based）出列的人的原始编号 idx。 */
  onEliminate?: (idx: number, round: number) => void;
  /** 递推每一步：规模 i 时幸存者为 survivor（相对编号）。 */
  onRecurrence?: (i: number, survivor: number) => void;
}

/**
 * 约瑟夫问题（递推解法）：n 人围圈，每数到第 k 个出列。
 * 返回最后幸存者的原始编号（0-based）。
 *
 * 递推：J(1,k)=0；J(i,k)=(J(i-1,k)+k) mod i。
 *
 * @param n 总人数（n >= 1）
 * @param k 步长（k >= 1）
 * @param hooks 可选事件钩子
 * @returns 幸存者原始编号（0-based）
 */
export function josephus(n: number, k: number, hooks: JosephusHooks = {}): number {
  if (n < 1) throw new Error(`n 必须 >= 1 / n must be >= 1, got ${n}`);
  if (k < 1) throw new Error(`k 必须 >= 1 / k must be >= 1, got ${k}`);

  let survivor = 0; // J(1, k) = 0
  hooks.onRecurrence?.(1, survivor);
  for (let i = 2; i <= n; i++) {
    survivor = (survivor + k) % i;
    hooks.onRecurrence?.(i, survivor);
  }
  return survivor;
}

/**
 * 约瑟夫出列顺序（模拟解法）：依次返回每一轮被淘汰者的原始编号。
 * 返回长度为 n 的数组，第 round 个元素即第 round 个出列的人。
 *
 * @param n 总人数（n >= 1）
 * @param k 步长（k >= 1）
 * @param hooks 可选事件钩子（onEliminate 在每次出列时触发）
 * @returns 出列顺序数组（原始编号，0-based）
 */
export function josephusSequence(n: number, k: number, hooks: JosephusHooks = {}): number[] {
  if (n < 1) throw new Error(`n 必须 >= 1 / n must be >= 1, got ${n}`);
  if (k < 1) throw new Error(`k 必须 >= 1 / k must be >= 1, got ${k}`);

  const people: number[] = [];
  for (let i = 0; i < n; i++) people.push(i);

  const order: number[] = [];
  let idx = 0; // 下一个待计数位置（存活者数组下标）
  for (let round = 1; round <= n; round++) {
    idx = (idx + k - 1) % people.length;
    const removed = people.splice(idx, 1)[0]!;
    order.push(removed);
    hooks.onEliminate?.(removed, round);
  }
  return order;
}
