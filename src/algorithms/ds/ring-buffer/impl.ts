// =============================================================================
// 环形缓冲区 Ring Buffer · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：定长数组 + read/write 两指针 + count 计数（区分空/满）。
//   - write 指向下一个待写入位置；read 指向下一个待读取位置。
//   - 两指针都在模 capacity 下「环绕」，写入/读取均 O(1)，无元素搬移。
//   - 队满时写入返回 false（覆盖模式可选，本实现采用「丢弃新数据」语义）。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface RingBufferHooks {
  /** 写入：把 value 写入下标 write。 */
  onWrite?: (write: number, value: number) => void;
  /** 读取：从下标 read 取出 value。 */
  onRead?: (read: number, value: number) => void;
  /** 缓冲区状态变化。 */
  onState?: (read: number, write: number, count: number) => void;
  /** 写入失败（缓冲区满）。 */
  onOverflow?: (value: number) => void;
}

/**
 * 环形缓冲区（固定容量）。
 * 用 read/write 两环绕指针 + count 计数区分空 / 满。
 */
export class RingBuffer {
  private data: number[];
  readonly capacity: number;
  private readIdx = 0;
  private writeIdx = 0;
  private cnt = 0;

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.data = new Array<number>(this.capacity).fill(0);
  }

  /** 当前元素数。 */
  get size(): number {
    return this.cnt;
  }

  /** 读指针下标。 */
  get read(): number {
    return this.readIdx;
  }

  /** 写指针下标。 */
  get write(): number {
    return this.writeIdx;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.cnt === 0;
  }

  /** 是否已满。 */
  isFull(): boolean {
    return this.cnt === this.capacity;
  }

  /** 写入一个值。缓冲区满时丢弃该值并返回 false。 */
  writeValue(value: number, hooks: RingBufferHooks = {}): boolean {
    if (this.isFull()) {
      hooks.onOverflow?.(value);
      return false;
    }
    this.data[this.writeIdx] = value;
    hooks.onWrite?.(this.writeIdx, value);
    this.writeIdx = (this.writeIdx + 1) % this.capacity;
    this.cnt++;
    hooks.onState?.(this.readIdx, this.writeIdx, this.cnt);
    return true;
  }

  /** 读取一个值。缓冲区空时返回 undefined。 */
  readValue(hooks: RingBufferHooks = {}): number | undefined {
    if (this.isEmpty()) return undefined;
    const value = this.data[this.readIdx]!;
    hooks.onRead?.(this.readIdx, value);
    this.data[this.readIdx] = 0; // 清空占位
    this.readIdx = (this.readIdx + 1) % this.capacity;
    this.cnt--;
    hooks.onState?.(this.readIdx, this.writeIdx, this.cnt);
    return value;
  }

  /** 查看队首（不读取）。 */
  peek(): number | undefined {
    if (this.isEmpty()) return undefined;
    return this.data[this.readIdx];
  }

  /** 底层数组副本（用于可视化，含空槽）。 */
  toArray(): number[] {
    return [...this.data];
  }

  /** 按 read→write 顺序返回当前有效元素。 */
  toSequence(): number[] {
    const out: number[] = [];
    for (let k = 0; k < this.cnt; k++) {
      out.push(this.data[(this.readIdx + k) % this.capacity]!);
    }
    return out;
  }
}

/**
 * 便利函数：对一组操作（数值=写入，null=读取）顺序执行，返回读取到的值序列。
 */
export function ringBuffer(
  capacity: number,
  ops: ReadonlyArray<number | null>,
  hooks: RingBufferHooks = {},
): number[] {
  const rb = new RingBuffer(capacity);
  const out: number[] = [];
  for (const op of ops) {
    if (op === null) {
      const v = rb.readValue(hooks);
      if (v !== undefined) out.push(v);
    } else {
      rb.writeValue(op, hooks);
    }
  }
  return out;
}
