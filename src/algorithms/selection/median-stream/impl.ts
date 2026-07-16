// =============================================================================
// 数据流中位数（Median Stream）· 纯算法实现
// 大顶堆 + 小顶堆。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface MedianFinderHooks {
  /** 每次 addNum 完成平衡后触发，给出当前两堆规模。 */
  onBalance?: (loSize: number, hiSize: number) => void;
  /** 查询中位数时触发。 */
  onQuery?: (median: number) => void;
}

/** 二叉堆（可选大顶/小顶）。 */
class Heap {
  private readonly a: number[] = [];
  constructor(private readonly isMaxHeap: boolean) {}

  get size(): number {
    return this.a.length;
  }
  top(): number | null {
    return this.a.length === 0 ? null : this.a[0]!;
  }
  private better(i: number, j: number): boolean {
    return this.isMaxHeap ? this.a[i]! > this.a[j]! : this.a[i]! < this.a[j]!;
  }
  private swap(i: number, j: number): void {
    const t = this.a[i]!;
    this.a[i] = this.a[j]!;
    this.a[j] = t;
  }
  push(v: number): void {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.better(i, p)) {
        this.swap(i, p);
        i = p;
      } else break;
    }
  }
  pop(): number {
    const top = this.a[0]!;
    const last = this.a.pop()!;
    if (this.a.length > 0) {
      this.a[0] = last;
      let i = 0;
      const n = this.a.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let best = i;
        if (l < n && this.better(l, best)) best = l;
        if (r < n && this.better(r, best)) best = r;
        if (best === i) break;
        this.swap(i, best);
        i = best;
      }
    }
    return top;
  }
  /** 返回当前堆内容的快照（不保证顺序，仅供展示）。 */
  snapshot(): number[] {
    return [...this.a];
  }
}

/**
 * 数据流中位数计算器。
 * lo 为大顶堆（较小半），hi 为小顶堆（较大半）。
 */
export class MedianFinder {
  private readonly lo = new Heap(true);
  private readonly hi = new Heap(false);
  private readonly hooks?: MedianFinderHooks;

  constructor(hooks: MedianFinderHooks = {}) {
    this.hooks = hooks;
  }

  /** 添加一个数到数据流。 */
  addNum(n: number): this {
    if (this.lo.size === 0 || n <= (this.lo.top() ?? n)) {
      this.lo.push(n);
    } else {
      this.hi.push(n);
    }
    // 平衡
    if (this.lo.size > this.hi.size + 1) {
      this.hi.push(this.lo.pop());
    } else if (this.hi.size > this.lo.size) {
      this.lo.push(this.hi.pop());
    }
    this.hooks?.onBalance?.(this.lo.size, this.hi.size);
    return this;
  }

  /** 当前所有数的中位数。 */
  findMedian(): number {
    const loTop = this.lo.top();
    if (this.lo.size === this.hi.size) {
      const hiTop = this.hi.top();
      const median = ((loTop ?? 0) + (hiTop ?? 0)) / 2;
      this.hooks?.onQuery?.(median);
      return median;
    }
    const median = loTop ?? 0;
    this.hooks?.onQuery?.(median);
    return median;
  }

  /** lo 堆内容快照（较小半）。 */
  loSnapshot(): number[] {
    return this.lo.snapshot();
  }
  /** hi 堆内容快照（较大半）。 */
  hiSnapshot(): number[] {
    return this.hi.snapshot();
  }
  /** 已加入的元素总数。 */
  get total(): number {
    return this.lo.size + this.hi.size;
  }
}
