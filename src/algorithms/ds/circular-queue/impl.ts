// =============================================================================
// 循环队列 Circular Queue · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：定长数组 + 两个指针 front / rear（都向「右」环绕）。
//   - 约定：front 指向队首元素；rear 指向下一个待写入位置（不存元素）。
//   - 用 count 区分队空 / 队满，避免「牺牲一个槽位」的歧义。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface CircularQueueHooks {
  /** 入队：把 value 写入下标 rear。 */
  onEnqueue?: (rear: number, value: number) => void;
  /** 出队：取出队首下标 front 的值。 */
  onDequeue?: (front: number, value: number) => void;
  /** 队列状态变化。 */
  onState?: (front: number, rear: number, count: number) => void;
}

/**
 * 循环队列（环形缓冲区 / Ring Buffer）。
 * 容量固定为 capacity；用 count 计数区分空 / 满。
 */
export class CircularQueue {
  /** 底层数组。空槽记 0（仅占位，无语义）。 */
  private data: number[];
  /** 容量。 */
  readonly capacity: number;
  /** 队首下标。 */
  private frontIdx = 0;
  /** 下一个入队位置（不存元素）。 */
  private rearIdx = 0;
  /** 当前元素数。 */
  private cnt = 0;

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.data = new Array<number>(this.capacity).fill(0);
  }

  /** 当前元素数。 */
  get size(): number {
    return this.cnt;
  }

  /** 队首下标。 */
  get front(): number {
    return this.frontIdx;
  }

  /** 下一个入队位置。 */
  get rear(): number {
    return this.rearIdx;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.cnt === 0;
  }

  /** 是否已满。 */
  isFull(): boolean {
    return this.cnt === this.capacity;
  }

  /** 入队。队满返回 false。 */
  enqueue(value: number, hooks: CircularQueueHooks = {}): boolean {
    if (this.isFull()) return false;
    this.data[this.rearIdx] = value;
    hooks.onEnqueue?.(this.rearIdx, value);
    this.rearIdx = (this.rearIdx + 1) % this.capacity;
    this.cnt++;
    hooks.onState?.(this.frontIdx, this.rearIdx, this.cnt);
    return true;
  }

  /** 出队。队空返回 undefined。 */
  dequeue(hooks: CircularQueueHooks = {}): number | undefined {
    if (this.isEmpty()) return undefined;
    const value = this.data[this.frontIdx]!;
    hooks.onDequeue?.(this.frontIdx, value);
    this.data[this.frontIdx] = 0; // 清空占位
    this.frontIdx = (this.frontIdx + 1) % this.capacity;
    this.cnt--;
    hooks.onState?.(this.frontIdx, this.rearIdx, this.cnt);
    return value;
  }

  /** 查看队首（不弹出）。队空返回 undefined。 */
  peekFront(): number | undefined {
    if (this.isEmpty()) return undefined;
    return this.data[this.frontIdx];
  }

  /** 查看队尾。队空返回 undefined。 */
  peekRear(): number | undefined {
    if (this.isEmpty()) return undefined;
    // rear 指向下一写入位，故队尾 = (rear - 1 + cap) % cap
    return this.data[(this.rearIdx - 1 + this.capacity) % this.capacity];
  }

  /** 底层数组副本（用于断言/可视化）。 */
  toArray(): number[] {
    return [...this.data];
  }

  /** 按出队顺序返回当前元素（不修改队列）。 */
  toSequence(): number[] {
    const out: number[] = [];
    for (let k = 0; k < this.cnt; k++) {
      out.push(this.data[(this.frontIdx + k) % this.capacity]!);
    }
    return out;
  }
}

/**
 * 便利函数：对一组操作（入/出）顺序执行，返回最终队列内容。
 * ops: 1..n 表示入队该值；null 表示出队。
 */
export function circularQueue(
  capacity: number,
  ops: ReadonlyArray<number | null>,
  hooks: CircularQueueHooks = {},
): CircularQueue {
  const q = new CircularQueue(capacity);
  for (const op of ops) {
    if (op === null) q.dequeue(hooks);
    else q.enqueue(op, hooks);
  }
  return q;
}
