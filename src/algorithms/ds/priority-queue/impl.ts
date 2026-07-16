// =============================================================================
// 优先队列 Priority Queue · 纯算法实现
// 二叉堆封装。默认最小堆（数值越小优先级越高）；可传比较器改为最大堆。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** 比较器：返回 true 表示 a 的优先级高于 b（应在堆顶方向）。 */
export type PQCompare = (a: number, b: number) => boolean;

/** 操作过程中的事件钩子。任一可选。 */
export interface PriorityQueueHooks {
  /** 比较下标 i、j 的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 插入完成（元素最终落点 idx）。 */
  onInsertDone?: (idx: number, value: number) => void;
  /** 弹出完成（堆顶被取出，value 为弹出值）。 */
  onExtractDone?: (value: number) => void;
}

/** 默认最小堆比较器：小值优先。 */
const MIN_HEAP: PQCompare = (a, b) => a < b;

/**
 * 优先队列（二叉堆封装）。
 *   索引约定（0-based）：parent(i)=(i-1)>>1, left=2i+1, right=2i+2
 */
export class PriorityQueue {
  private data: number[] = [];
  private readonly higher: PQCompare;

  constructor(compare: PQCompare = MIN_HEAP) {
    this.higher = compare;
  }

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /** 查看堆顶（不弹出）。 */
  peek(): number | undefined {
    return this.data[0];
  }

  /** 底层数组副本（用于断言/可视化）。 */
  toArray(): number[] {
    return [...this.data];
  }

  /** 插入：放到末尾后上浮。 */
  push(value: number, hooks: PriorityQueueHooks = {}): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1, hooks);
    hooks.onInsertDone?.(this.indexOf(value), value);
  }

  /** 弹出堆顶：末尾换顶再下沉。空堆返回 undefined。 */
  pop(hooks: PriorityQueueHooks = {}): number | undefined {
    const n = this.data.length;
    if (n === 0) return undefined;
    const top = this.data[0]!;
    if (n === 1) {
      this.data.pop();
      hooks.onExtractDone?.(top);
      return top;
    }
    this.data[0] = this.data.pop()!;
    hooks.onSwap?.(0, n - 1); // 概念上的「取出堆顶」
    this.siftDown(0, hooks);
    hooks.onExtractDone?.(top);
    return top;
  }

  /** 由数组原地建堆（Floyd，O(n)）。 */
  buildHeap(values: readonly number[], hooks: PriorityQueueHooks = {}): void {
    this.data = [...values];
    for (let i = (this.data.length >> 1) - 1; i >= 0; i--) {
      this.siftDown(i, hooks);
    }
  }

  /** 上浮。 */
  private siftUp(i: number, hooks: PriorityQueueHooks): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      hooks.onCompare?.(i, parent);
      if (this.higher(this.data[i]!, this.data[parent]!)) {
        this.swap(i, parent);
        hooks.onSwap?.(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  /** 下沉。 */
  private siftDown(i: number, hooks: PriorityQueueHooks): void {
    const n = this.data.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < n) {
        hooks.onCompare?.(l, best);
        if (this.higher(this.data[l]!, this.data[best]!)) best = l;
      }
      if (r < n) {
        hooks.onCompare?.(r, best);
        if (this.higher(this.data[r]!, this.data[best]!)) best = r;
      }
      if (best === i) break;
      this.swap(i, best);
      hooks.onSwap?.(i, best);
      i = best;
    }
  }

  private swap(i: number, j: number): void {
    const t = this.data[i]!;
    this.data[i] = this.data[j]!;
    this.data[j] = t;
  }

  /** 查找某值首次出现的下标（用于钩子定位落点）。 */
  private indexOf(value: number): number {
    return this.data.indexOf(value);
  }
}

/** 默认最大堆比较器：大值优先。 */
export const MAX_HEAP: PQCompare = (a, b) => a > b;

/** 便利函数：建堆并连续弹出，返回弹出顺序（最小堆即升序）。 */
export function priorityQueue(
  values: readonly number[],
  compare: PQCompare = MIN_HEAP,
  hooks: PriorityQueueHooks = {},
  options: { extract?: number } = {},
): { heap: number[]; popped: number[] } {
  const pq = new PriorityQueue(compare);
  pq.buildHeap(values, hooks);
  const popped: number[] = [];
  const k = options.extract ?? values.length;
  for (let i = 0; i < k && !pq.isEmpty(); i++) {
    const v = pq.pop(hooks);
    if (v !== undefined) popped.push(v);
  }
  return { heap: pq.toArray(), popped };
}
