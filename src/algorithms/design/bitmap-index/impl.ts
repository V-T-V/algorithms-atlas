// 位图索引 · 纯算法实现
// 用 Uint32Array 存比特，每个元素管理 32 个值。

/** 事件钩子。 */
export interface BitmapIndexHooks {
  /** 添加值 v：在第 v 位置 1。 */
  onAdd?: (v: number) => void;
  /** 查询值 v 是否存在。 */
  onQuery?: (v: number, present: boolean) => void;
  /** 删除值 v：第 v 位置 0。 */
  onRemove?: (v: number) => void;
}

/**
 * 位图索引：记录值域 [0, size) 内的集合。
 * 每个值占 1 bit，用 Uint32Array 存储。
 */
export class BitmapIndex {
  private readonly words: Uint32Array;
  private count = 0;
  readonly size: number;

  constructor(
    size: number,
    private hooks: BitmapIndexHooks = {},
  ) {
    if (!Number.isInteger(size) || size <= 0) {
      throw new RangeError('size must be a positive integer');
    }
    this.size = size;
    this.words = new Uint32Array(Math.ceil(size / 32));
  }

  /** 把值 v 加入集合（第 v 位置 1）。返回是否首次加入。 */
  add(v: number): boolean {
    if (!Number.isInteger(v) || v < 0 || v >= this.size) {
      throw new RangeError(`value out of range: ${v}`);
    }
    const wordIdx = v >>> 5; // /32
    const bitIdx = v & 31; // %32
    const mask = 1 << bitIdx;
    if ((this.words[wordIdx]! & mask) !== 0) {
      this.hooks.onAdd?.(v);
      return false; // 已存在
    }
    this.words[wordIdx]! |= mask;
    this.count++;
    this.hooks.onAdd?.(v);
    return true;
  }

  /** 查询 v 是否存在。 */
  has(v: number): boolean {
    if (!Number.isInteger(v) || v < 0 || v >= this.size) {
      throw new RangeError(`value out of range: ${v}`);
    }
    const wordIdx = v >>> 5;
    const bitIdx = v & 31;
    const present = (this.words[wordIdx]! & (1 << bitIdx)) !== 0;
    this.hooks.onQuery?.(v, present);
    return present;
  }

  /** 删除值 v（第 v 位置 0）。返回是否确有删除。 */
  remove(v: number): boolean {
    if (!Number.isInteger(v) || v < 0 || v >= this.size) {
      throw new RangeError(`value out of range: ${v}`);
    }
    const wordIdx = v >>> 5;
    const bitIdx = v & 31;
    const mask = 1 << bitIdx;
    if ((this.words[wordIdx]! & mask) === 0) {
      this.hooks.onRemove?.(v);
      return false;
    }
    this.words[wordIdx]! &= ~mask;
    this.count--;
    this.hooks.onRemove?.(v);
    return true;
  }

  /** 集合当前元素数。 */
  sizeOf(): number {
    return this.count;
  }

  /** 清空。 */
  clear(): void {
    this.words.fill(0);
    this.count = 0;
  }

  /** 列出所有存在值（升序）。 */
  toArray(): number[] {
    const out: number[] = [];
    for (let w = 0; w < this.words.length; w++) {
      const word = this.words[w]!;
      if (word === 0) continue;
      for (let b = 0; b < 32; b++) {
        const v = w * 32 + b;
        if (v >= this.size) break;
        if ((word & (1 << b)) !== 0) out.push(v);
      }
    }
    return out;
  }

  /** 与另一个位图（同 size）按位 OR，返回新位图。 */
  union(other: BitmapIndex): BitmapIndex {
    if (other.size !== this.size) throw new RangeError('size mismatch');
    const r = new BitmapIndex(this.size);
    for (let w = 0; w < this.words.length; w++) {
      r.words[w] = this.words[w]! | other.words[w]!;
    }
    r.count = r.toArray().length;
    return r;
  }
}
