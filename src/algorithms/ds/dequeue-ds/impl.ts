// =============================================================================
// 双端队列（Deque，动态数组 + 循环缓冲）· 纯算法实现
// 两端均摊 O(1) 入/出队，支持随机访问与自动扩容。零 DOM 依赖，可独立单测。
// =============================================================================

export interface DequeHooks {
  onPushFront?: (idx: number, value: number) => void;
  onPushBack?: (idx: number, value: number) => void;
  onPopFront?: (idx: number, value: number) => void;
  onPopBack?: (idx: number, value: number) => void;
  onGrow?: (oldCap: number, newCap: number) => void;
}

export class Deque {
  private buf: number[];
  private cap: number;
  /** head 指向队首元素下标（空队列时无意义）。 */
  head = 0;
  /** tail 指向下一个队尾写入位置。 */
  tail = 0;
  private count = 0;

  constructor(capacity = 8) {
    this.cap = Math.max(1, capacity);
    this.buf = new Array<number>(this.cap).fill(NaN);
  }

  get size(): number {
    return this.count;
  }
  get capacity(): number {
    return this.cap;
  }
  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 扩容到 newCap，搬移元素到 [0, count)。 */
  private grow(newCap: number, hooks: DequeHooks): void {
    const old = this.toSequence();
    const oldCap = this.cap;
    this.buf = new Array<number>(newCap).fill(NaN);
    for (let i = 0; i < old.length; i++) this.buf[i] = old[i]!;
    this.cap = newCap;
    this.head = 0;
    this.tail = this.count;
    hooks.onGrow?.(oldCap, newCap);
  }

  pushFront(value: number, hooks: DequeHooks = {}): void {
    if (this.count === this.cap) this.grow(this.cap * 2, hooks);
    this.head = (this.head - 1 + this.cap) % this.cap;
    this.buf[this.head] = value;
    this.count++;
    hooks.onPushFront?.(this.head, value);
  }

  pushBack(value: number, hooks: DequeHooks = {}): void {
    if (this.count === this.cap) this.grow(this.cap * 2, hooks);
    this.buf[this.tail] = value;
    this.tail = (this.tail + 1) % this.cap;
    this.count++;
    hooks.onPushBack?.((this.tail - 1 + this.cap) % this.cap, value);
  }

  popFront(hooks: DequeHooks = {}): number | null {
    if (this.count === 0) return null;
    const v = this.buf[this.head]!;
    this.buf[this.head] = NaN;
    const idx = this.head;
    this.head = (this.head + 1) % this.cap;
    this.count--;
    hooks.onPopFront?.(idx, v);
    return v;
  }

  popBack(hooks: DequeHooks = {}): number | null {
    if (this.count === 0) return null;
    this.tail = (this.tail - 1 + this.cap) % this.cap;
    const v = this.buf[this.tail]!;
    this.buf[this.tail] = NaN;
    const idx = this.tail;
    this.count--;
    hooks.onPopBack?.(idx, v);
    return v;
  }

  /** 随机访问逻辑下标 i（0-based，front→back）。 */
  get(i: number): number | null {
    if (i < 0 || i >= this.count) return null;
    return this.buf[(this.head + i) % this.cap] ?? null;
  }

  /** 逻辑序列（front→back）。 */
  toSequence(): number[] {
    const out: number[] = [];
    for (let k = 0; k < this.count; k++) out.push(this.buf[(this.head + k) % this.cap]!);
    return out;
  }

  /** 底层缓冲区快照（含未占位）。 */
  toArray(): number[] {
    return [...this.buf];
  }
}
