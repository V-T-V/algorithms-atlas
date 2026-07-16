// =============================================================================
// 队列重建（Queue Reconstruction by Height）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 人：身高 h 与前面身高 >= h 的人数 k。 */
export interface Person {
  h: number;
  k: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface QueueReconHooks {
  onSort?: (order: number[]) => void;
  onInsert?: (idx: number, at: number) => void;
  onResult?: (queue: Person[]) => void;
}

export interface QueueReconResult {
  /** 重建后的队列顺序。 */
  queue: Person[];
}

/**
 * 队列重建（LeetCode 406）：people[i] = [h, k]，重建原队列顺序。
 *
 * 贪心：按身高降序（同身高 k 小的在前），依次把每个人插到结果数组的第 k 位。
 * 先插高个子不影响矮个子的 k 计数。
 * @param people 输入
 * @param hooks 可选的事件钩子
 */
export function queueRecon(people: Person[], hooks: QueueReconHooks = {}): QueueReconResult {
  const order = people
    .map((p, i) => ({ i, ...p }))
    .sort((a, b) => (a.h !== b.h ? b.h - a.h : a.k - b.k));
  hooks.onSort?.(order.map((o) => o.i));

  const queue: Person[] = [];
  for (const o of order) {
    queue.splice(o.k, 0, { h: o.h, k: o.k });
    hooks.onInsert?.(o.i, o.k);
  }
  hooks.onResult?.(queue);
  return { queue };
}
