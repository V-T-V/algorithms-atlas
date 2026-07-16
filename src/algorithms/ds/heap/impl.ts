// =============================================================================
// 二叉堆 Binary Heap · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：数组表示的最小堆（min-heap）。父 < 子。
//   索引约定（0-based）：parent(i)=(i-1)>>1, left=2i+1, right=2i+2
// =============================================================================

/** 比较器：默认最小堆。 */
export type HeapCompare = (a: number, b: number) => boolean; // true 表示 a 应在 b 上方

/** 堆操作过程中的事件钩子。任一可选。 */
export interface HeapHooks {
  /** 比较下标 i、j 的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** sift-up / sift-down 沿路径结束。 */
  onSift?: (i: number) => void;
}

/** 默认最小堆比较器。 */
const MIN_HEAP: HeapCompare = (a, b) => a < b;

/**
 * 二叉堆（数组实现）。默认最小堆；传入比较器可改为最大堆。
 */
export class BinaryHeap {
  private data: number[] = [];
  private readonly less: HeapCompare;

  constructor(compare: HeapCompare = MIN_HEAP) {
    this.less = compare;
  }

  /** 当前元素个数。 */
  get size(): number {
    return this.data.length;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /** 查看堆顶（不弹出）。 */
  peek(): number | undefined {
    return this.data[0];
  }

  /** 内部数组副本（用于断言/快照）。 */
  toArray(): number[] {
    return [...this.data];
  }

  /** 插入一个值：放到末尾后上浮。 */
  insert(value: number, hooks: HeapHooks = {}): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1, hooks);
  }

  /** 弹出堆顶：把末尾换到顶部再下沉。返回 undefined 表示空堆。 */
  extract(hooks: HeapHooks = {}): number | undefined {
    const n = this.data.length;
    if (n === 0) return undefined;
    const top = this.data[0]!;
    if (n === 1) {
      this.data.pop();
      return top;
    }
    // 末尾移到顶部
    this.data[0] = this.data.pop()!;
    hooks.onSwap?.(0, n - 1); // 概念上的「取出堆顶」
    this.siftDown(0, hooks);
    return top;
  }

  /** 由数组原地建堆（Floyd，自底向下沉，O(n)）。 */
  buildHeap(values: readonly number[], hooks: HeapHooks = {}): void {
    this.data = [...values];
    for (let i = (this.data.length >> 1) - 1; i >= 0; i--) {
      this.siftDown(i, hooks);
    }
  }

  /** 上浮：把 i 处元素沿父链上移直到恢复堆序。 */
  private siftUp(i: number, hooks: HeapHooks): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      hooks.onCompare?.(i, parent);
      if (this.less(this.data[i]!, this.data[parent]!)) {
        this.swap(i, parent);
        hooks.onSwap?.(i, parent);
        i = parent;
      } else {
        break;
      }
    }
    hooks.onSift?.(i);
  }

  /** 下沉：把 i 处元素沿较小子节点下移直到恢复堆序。 */
  private siftDown(i: number, hooks: HeapHooks): void {
    const n = this.data.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < n) {
        hooks.onCompare?.(l, best);
        if (this.less(this.data[l]!, this.data[best]!)) best = l;
      }
      if (r < n) {
        hooks.onCompare?.(r, best);
        if (this.less(this.data[r]!, this.data[best]!)) best = r;
      }
      if (best === i) break;
      this.swap(i, best);
      hooks.onSwap?.(i, best);
      i = best;
    }
    hooks.onSift?.(i);
  }

  private swap(i: number, j: number): void {
    const t = this.data[i]!;
    this.data[i] = this.data[j]!;
    this.data[j] = t;
  }
}

/** 便利函数：对数组原地建堆并返回堆化的数组（默认最小堆）。 */
export function heap(
  values: readonly number[],
  compare: HeapCompare = MIN_HEAP,
  hooks: HeapHooks = {},
): number[] {
  const h = new BinaryHeap(compare);
  h.buildHeap(values, hooks);
  return h.toArray();
}
