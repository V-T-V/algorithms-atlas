// =============================================================================
// 合并果子（Huffman Task）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：n 堆果子，每次合并任意两堆代价为两堆之和，求把所有果堆合并成一堆的最小总代价。
// 等价于构造 Huffman 树：每次合并当前最小的两堆，贪心得到全局最优。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HuffmanTaskHooks {
  /** 每次「取出最小两堆」前，给出当前所有堆的内容。 */
  onPickMin?: (piles: number[]) => void;
  /** 一次合并：取出的两小堆 a、b，合并得到的新堆 c = a + b。 */
  onMerge?: (a: number, b: number, c: number, piles: number[]) => void;
}

/** 求解结果。 */
export interface HuffmanTaskResult {
  /** 最小总代价（体力消耗）。 */
  totalCost: number;
  /** 每次合并的三元组 [a, b, a+b]，按发生顺序。 */
  merges: Array<[number, number, number]>;
}

/** 最小堆（基于数组，下标从 0 开始）。仅服务本算法，保持极简。 */
class MinHeap {
  private readonly a: number[] = [];
  size(): number {
    return this.a.length;
  }
  peek(): number | undefined {
    return this.a[0];
  }
  push(v: number): void {
    this.a.push(v);
    this.siftUp(this.a.length - 1);
  }
  pop(): number | undefined {
    if (this.a.length === 0) return undefined;
    const top = this.a[0]!;
    const last = this.a.pop()!;
    if (this.a.length > 0) {
      this.a[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  /** 返回当前堆内容的升序拷贝（仅用于展示，不保证原堆顺序）。 */
  snapshot(): number[] {
    return [...this.a].sort((x, y) => x - y);
  }
  private siftUp(i: number): void {
    let k = i;
    while (k > 0) {
      const parent = (k - 1) >> 1;
      if (this.a[k]! < this.a[parent]!) {
        [this.a[k], this.a[parent]] = [this.a[parent]!, this.a[k]!];
        k = parent;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.a.length;
    let k = i;
    for (;;) {
      let smallest = k;
      const l = 2 * k + 1;
      const r = 2 * k + 2;
      if (l < n && this.a[l]! < this.a[smallest]!) smallest = l;
      if (r < n && this.a[r]! < this.a[smallest]!) smallest = r;
      if (smallest === k) break;
      [this.a[k], this.a[smallest]] = [this.a[smallest]!, this.a[k]!];
      k = smallest;
    }
  }
}

/**
 * 合并果子（Huffman 贪心）：每次合并当前最小的两堆。
 *
 * 贪心策略：用最小堆维护各堆大小。循环 n−1 次：取出最小的两堆 a、b，
 * 合并成 c = a + b（代价 c），把 c 放回堆。总代价 = 每次合并代价之和。
 *
 * 直观理解：被合并得越早的堆，其重量会在后续每次合并中重复计入代价，
 * 因此把小的堆尽早合并、大的堆尽量晚合并，总代价最小。这正是 Huffman 编码
 * 构造最优前缀码时使用的同一贪心——每堆果子等价于一个字符的频次。
 *
 * @param piles 各堆果子数量（会被克隆；调用方数组不被修改）
 * @param hooks 可选的事件钩子
 */
export function huffmanTask(
  piles: readonly number[],
  hooks: HuffmanTaskHooks = {},
): HuffmanTaskResult {
  const n = piles.length;
  if (n === 0) return { totalCost: 0, merges: [] };
  if (n === 1) return { totalCost: 0, merges: [] };

  const heap = new MinHeap();
  for (const p of piles) heap.push(p);

  let totalCost = 0;
  const merges: Array<[number, number, number]> = [];
  const remain = n;

  for (let step = 0; step < remain - 1; step++) {
    hooks.onPickMin?.(heap.snapshot());
    const a = heap.pop()!;
    const b = heap.pop()!;
    const c = a + b;
    heap.push(c);
    totalCost += c;
    merges.push([a, b, c]);
    hooks.onMerge?.(a, b, c, heap.snapshot());
  }

  return { totalCost, merges };
}
