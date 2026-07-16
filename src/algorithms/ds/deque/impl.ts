// =============================================================================
// 双端队列 Deque · 纯算法实现
// 两端均可 O(1) 入队 / 出队。环形缓冲区实现。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface DequeHooks {
  /** 在队首入队 value，写入下标 idx。 */
  onPushFront?: (idx: number, value: number) => void;
  /** 在队尾入队 value，写入下标 idx。 */
  onPushBack?: (idx: number, value: number) => void;
  /** 从队首出队，取自下标 idx。 */
  onPopFront?: (idx: number, value: number) => void;
  /** 从队尾出队，取自下标 idx。 */
  onPopBack?: (idx: number, value: number) => void;
}

/**
 * 双端队列（环形缓冲区实现）。
 * 容量固定为 capacity；用 count 计数区分空 / 满。
 *   - front 指向队首元素
 *   - rear 指向下一个待写入位置（不存元素）
 */
export class Deque {
  private data: number[];
  readonly capacity: number;
  private frontIdx = 0;
  private rearIdx = 0;
  private cnt = 0;

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.data = new Array<number>(this.capacity).fill(0);
  }

  get size(): number {
    return this.cnt;
  }

  get front(): number {
    return this.frontIdx;
  }

  get rear(): number {
    return this.rearIdx;
  }

  isEmpty(): boolean {
    return this.cnt === 0;
  }

  isFull(): boolean {
    return this.cnt === this.capacity;
  }

  /** 队首入队。队满返回 false。 */
  pushFront(value: number, hooks: DequeHooks = {}): boolean {
    if (this.isFull()) return false;
    // front 前移一位（环绕）
    this.frontIdx = (this.frontIdx - 1 + this.capacity) % this.capacity;
    this.data[this.frontIdx] = value;
    this.cnt++;
    hooks.onPushFront?.(this.frontIdx, value);
    return true;
  }

  /** 队尾入队。队满返回 false。 */
  pushBack(value: number, hooks: DequeHooks = {}): boolean {
    if (this.isFull()) return false;
    this.data[this.rearIdx] = value;
    this.cnt++;
    hooks.onPushBack?.(this.rearIdx, value);
    this.rearIdx = (this.rearIdx + 1) % this.capacity;
    return true;
  }

  /** 队首出队。队空返回 undefined。 */
  popFront(hooks: DequeHooks = {}): number | undefined {
    if (this.isEmpty()) return undefined;
    const value = this.data[this.frontIdx]!;
    this.data[this.frontIdx] = 0;
    hooks.onPopFront?.(this.frontIdx, value);
    this.frontIdx = (this.frontIdx + 1) % this.capacity;
    this.cnt--;
    return value;
  }

  /** 队尾出队。队空返回 undefined。 */
  popBack(hooks: DequeHooks = {}): number | undefined {
    if (this.isEmpty()) return undefined;
    this.rearIdx = (this.rearIdx - 1 + this.capacity) % this.capacity;
    const value = this.data[this.rearIdx]!;
    this.data[this.rearIdx] = 0;
    hooks.onPopBack?.(this.rearIdx, value);
    this.cnt--;
    return value;
  }

  /** 查看队首（不弹出）。 */
  peekFront(): number | undefined {
    if (this.isEmpty()) return undefined;
    return this.data[this.frontIdx];
  }

  /** 查看队尾（不弹出）。 */
  peekBack(): number | undefined {
    if (this.isEmpty()) return undefined;
    return this.data[(this.rearIdx - 1 + this.capacity) % this.capacity];
  }

  /** 底层数组副本（用于可视化）。 */
  toArray(): number[] {
    return [...this.data];
  }

  /** 按出队顺序返回当前元素（front→back）。 */
  toSequence(): number[] {
    const out: number[] = [];
    for (let k = 0; k < this.cnt; k++) {
      out.push(this.data[(this.frontIdx + k) % this.capacity]!);
    }
    return out;
  }
}

/**
 * 便利函数：按一组操作构造双端队列。
 * op: { side: 'front'|'back', op: 'push'|'pop', value? }
 */
export function deque(
  capacity: number,
  ops: ReadonlyArray<{ side: 'front' | 'back'; op: 'push' | 'pop'; value?: number }>,
  hooks: DequeHooks = {},
): Deque {
  const q = new Deque(capacity);
  for (const o of ops) {
    if (o.op === 'push') {
      if (o.side === 'front') q.pushFront(o.value ?? 0, hooks);
      else q.pushBack(o.value ?? 0, hooks);
    } else {
      if (o.side === 'front') q.popFront(hooks);
      else q.popBack(hooks);
    }
  }
  return q;
}
