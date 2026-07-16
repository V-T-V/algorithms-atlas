// =============================================================================
// 动态数组（Dynamic Array）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：基于预分配缓冲区（容量 capacity）的数组，push 满时按 2 倍扩容。
//   push 均摊 O(1)；按下标随机访问 O(1)；插入/删除中间 O(n)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ArrayHooks {
  /** push 末尾追加一个值（扩容前/后由 onResize 单独报）。 */
  onPush?: (index: number, value: number) => void;
  /** 扩容：旧容量 → 新容量，元素被搬移。 */
  onResize?: (oldCap: number, newCap: number) => void;
  /** 在 index 处插入 value，后续元素后移。 */
  onInsert?: (index: number, value: number) => void;
  /** 删除 index 处元素，后续元素前移。返回被删值。 */
  onRemove?: (index: number, value: number) => void;
}

/**
 * 动态数组：维护一个底层数组缓冲区 `buf`（容量 capacity），
 * `size` 记实际元素数。push 满即扩容（2 倍）。
 */
export class DynamicArray {
  private buf: number[];
  private sz = 0;

  constructor(initialCapacity = 4) {
    this.buf = new Array<number>(Math.max(1, initialCapacity)).fill(0);
  }

  /** 当前元素数。 */
  get size(): number {
    return this.sz;
  }

  /** 当前缓冲区容量。 */
  get capacity(): number {
    return this.buf.length;
  }

  /** 下标访问。 */
  get(index: number): number {
    if (index < 0 || index >= this.sz) throw new RangeError(`index ${index} out of range`);
    return this.buf[index]!;
  }

  /** 内部缓冲区副本（size 范围内）。 */
  toArray(): number[] {
    return this.buf.slice(0, this.sz);
  }

  /** 末尾追加；必要时扩容。 */
  push(value: number, hooks: ArrayHooks = {}): void {
    if (this.sz === this.buf.length) {
      const oldCap = this.buf.length;
      const newCap = oldCap * 2;
      const next = new Array<number>(newCap).fill(0);
      for (let i = 0; i < this.sz; i++) next[i] = this.buf[i]!;
      this.buf = next;
      hooks.onResize?.(oldCap, newCap);
    }
    this.buf[this.sz] = value;
    hooks.onPush?.(this.sz, value);
    this.sz++;
  }

  /** 在 index 处插入 value；后续元素后移。必要时扩容。 */
  insert(index: number, value: number, hooks: ArrayHooks = {}): void {
    if (index < 0 || index > this.sz) throw new RangeError(`index ${index} out of range`);
    if (this.sz === this.buf.length) {
      const oldCap = this.buf.length;
      const newCap = oldCap * 2;
      const next = new Array<number>(newCap).fill(0);
      for (let i = 0; i < this.sz; i++) next[i] = this.buf[i]!;
      this.buf = next;
      hooks.onResize?.(oldCap, newCap);
    }
    for (let i = this.sz; i > index; i--) this.buf[i] = this.buf[i - 1]!;
    this.buf[index] = value;
    this.sz++;
    hooks.onInsert?.(index, value);
  }

  /** 删除 index 处元素；后续元素前移。返回被删值。 */
  remove(index: number, hooks: ArrayHooks = {}): number {
    if (index < 0 || index >= this.sz) throw new RangeError(`index ${index} out of range`);
    const val = this.buf[index]!;
    for (let i = index; i < this.sz - 1; i++) this.buf[i] = this.buf[i + 1]!;
    this.sz--;
    this.buf[this.sz] = 0; // 清理
    hooks.onRemove?.(index, val);
    return val;
  }
}

/** 便利函数：把一组值依次 push 进动态数组，返回其内部数组（演示扩容过程）。 */
export function array(values: readonly number[], hooks: ArrayHooks = {}): number[] {
  const da = new DynamicArray(4);
  for (const v of values) da.push(v, hooks);
  return da.toArray();
}
