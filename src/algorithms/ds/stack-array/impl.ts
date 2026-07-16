// =============================================================================
// 数组栈（Stack Array）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：用动态数组缓冲区模拟栈，top 指针指向栈顶（下一个空位）。push/pop 均 O(1)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StackHooks {
  /** 压入 value 到栈顶。 */
  onPush?: (size: number, value: number) => void;
  /** 弹出栈顶 value。 */
  onPop?: (size: number, value: number) => void;
  /** 容量扩容。 */
  onResize?: (oldCap: number, newCap: number) => void;
}

/** 数组实现的栈（LIFO）。 */
export class StackArray {
  private buf: number[];
  private sz = 0;

  constructor(initialCapacity = 8) {
    this.buf = new Array<number>(Math.max(1, initialCapacity)).fill(0);
  }

  get size(): number {
    return this.sz;
  }
  get capacity(): number {
    return this.buf.length;
  }
  isEmpty(): boolean {
    return this.sz === 0;
  }

  /** 查看栈顶。 */
  peek(): number | undefined {
    return this.sz === 0 ? undefined : this.buf[this.sz - 1];
  }

  /** 压栈。 */
  push(value: number, hooks: StackHooks = {}): void {
    if (this.sz === this.buf.length) {
      const oldCap = this.buf.length;
      const next = new Array<number>(oldCap * 2).fill(0);
      for (let i = 0; i < this.sz; i++) next[i] = this.buf[i]!;
      this.buf = next;
      hooks.onResize?.(oldCap, oldCap * 2);
    }
    this.buf[this.sz] = value;
    this.sz++;
    hooks.onPush?.(this.sz, value);
  }

  /** 弹栈。 */
  pop(hooks: StackHooks = {}): number | undefined {
    if (this.sz === 0) return undefined;
    this.sz--;
    const v = this.buf[this.sz]!;
    hooks.onPop?.(this.sz, v);
    return v;
  }

  /** 栈底→栈顶 的数组副本。 */
  toArray(): number[] {
    return this.buf.slice(0, this.sz);
  }
}

/** 便利函数：把一组值依次压栈再全部弹出，返回弹出序列（即逆序）。 */
export function stackArray(values: readonly number[], hooks: StackHooks = {}): number[] {
  const st = new StackArray(4);
  for (const v of values) st.push(v, hooks);
  const out: number[] = [];
  while (!st.isEmpty()) out.push(st.pop(hooks)!);
  return out;
}
