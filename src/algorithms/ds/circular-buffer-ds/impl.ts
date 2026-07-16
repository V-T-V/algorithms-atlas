// =============================================================================
// 循环缓冲区（Circular / Ring Buffer）· 纯算法实现
// 固定容量，读写指针取模回绕；支持阻塞/覆盖两种写模式。零 DOM 依赖，可独立单测。
// =============================================================================

export interface CircularBufferHooks {
  onWrite?: (idx: number, value: number, overwritten: boolean) => void;
  onRead?: (idx: number, value: number) => void;
  onFull?: () => void;
  onEmpty?: () => void;
}

export class CircularBuffer {
  private buf: number[];
  readonly capacity: number;
  /** read 指向下一个待读位置；write 指向下一个待写位置。 */
  read = 0;
  write = 0;
  private count = 0;

  constructor(capacity: number) {
    this.capacity = Math.max(1, Math.floor(capacity));
    this.buf = new Array<number>(this.capacity).fill(NaN);
  }

  get size(): number {
    return this.count;
  }
  isFull(): boolean {
    return this.count === this.capacity;
  }
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * 写入 value。
   * @param overwrite 满时是否覆盖最旧数据（true 覆盖并返回 true；false 不写返回 false）。
   */
  writeValue(value: number, overwrite = false, hooks: CircularBufferHooks = {}): boolean {
    if (this.isFull()) {
      hooks.onFull?.();
      if (!overwrite) return false;
      // 覆盖：write 与 read 同步前进，丢弃最旧
      this.buf[this.write] = value;
      hooks.onWrite?.(this.write, value, true);
      this.write = (this.write + 1) % this.capacity;
      this.read = (this.read + 1) % this.capacity;
      return true;
    }
    this.buf[this.write] = value;
    hooks.onWrite?.(this.write, value, false);
    this.write = (this.write + 1) % this.capacity;
    this.count++;
    return true;
  }

  /** 读取并移除队首；空返回 null。 */
  readValue(hooks: CircularBufferHooks = {}): number | null {
    if (this.isEmpty()) {
      hooks.onEmpty?.();
      return null;
    }
    const v = this.buf[this.read]!;
    const idx = this.read;
    this.buf[this.read] = NaN;
    this.read = (this.read + 1) % this.capacity;
    this.count--;
    hooks.onRead?.(idx, v);
    return v;
  }

  /** 查看队首（不移除）。 */
  peek(): number | null {
    if (this.isEmpty()) return null;
    return this.buf[this.read]!;
  }

  /** 底层数组快照（含未占位）。 */
  toArray(): number[] {
    return [...this.buf];
  }

  /** 逻辑序列（read→write，front→back）。 */
  toSequence(): number[] {
    const out: number[] = [];
    for (let k = 0; k < this.count; k++) {
      out.push(this.buf[(this.read + k) % this.capacity]!);
    }
    return out;
  }
}
