// =============================================================================
// 数组队列 Queue Array · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：用一块动态数组，head 指针指向队首；出队后元素整体前移（compact），
//   故入队均摊 O(1)、出队 O(n)（朴素实现，对照环形缓冲区看「搬移开销」）。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface QueueArrayHooks {
  /** 入队：value 写入队尾。 */
  onEnqueue?: (size: number, value: number) => void;
  /** 出队：取出队首 value，并触发整体前移。 */
  onDequeue?: (size: number, value: number) => void;
  /** 出队后元素整体前移（compact）。 */
  onCompact?: (movedCount: number) => void;
}

/**
 * 数组队列（朴素实现）：head=0 为队首，size 为元素数。
 * 出队后把剩余元素整体前移一位，保持 head 恒为 0。
 */
export class QueueArray {
  private data: number[];
  private sz = 0;

  constructor(initialCapacity = 8) {
    this.data = new Array<number>(Math.max(1, initialCapacity)).fill(0);
  }

  /** 元素个数。 */
  get size(): number {
    return this.sz;
  }

  /** 当前容量。 */
  get capacity(): number {
    return this.data.length;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.sz === 0;
  }

  /** 查看队首。 */
  peek(): number | undefined {
    return this.sz === 0 ? undefined : this.data[0];
  }

  /** 入队：必要时扩容，写入队尾。均摊 O(1)。 */
  enqueue(value: number, hooks: QueueArrayHooks = {}): void {
    if (this.sz === this.data.length) {
      const next = new Array<number>(this.data.length * 2).fill(0);
      for (let i = 0; i < this.sz; i++) next[i] = this.data[i]!;
      this.data = next;
    }
    this.data[this.sz] = value;
    this.sz++;
    hooks.onEnqueue?.(this.sz, value);
  }

  /** 出队：取出 data[0]，剩余元素整体前移。O(n)。空队返回 undefined。 */
  dequeue(hooks: QueueArrayHooks = {}): number | undefined {
    if (this.sz === 0) return undefined;
    const v = this.data[0]!;
    this.sz--;
    // 整体前移一位
    let moved = 0;
    for (let i = 0; i < this.sz; i++) {
      this.data[i] = this.data[i + 1]!;
      moved++;
    }
    this.data[this.sz] = 0; // 清理尾部
    hooks.onDequeue?.(this.sz, v);
    if (moved > 0) hooks.onCompact?.(moved);
    return v;
  }

  /** 队首→队尾 的值数组副本。 */
  toArray(): number[] {
    return this.data.slice(0, this.sz);
  }
}

/**
 * 便利函数：把一组值依次入队再全部出队，返回出队序列（FIFO，正序）。
 */
export function queueArray(values: readonly number[], hooks: QueueArrayHooks = {}): number[] {
  const q = new QueueArray(4);
  for (const v of values) q.enqueue(v, hooks);
  const out: number[] = [];
  while (!q.isEmpty()) out.push(q.dequeue(hooks)!);
  return out;
}
