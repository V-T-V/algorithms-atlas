// 第 k 大（小顶堆）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每一步。

/** 事件钩子。 */
export interface KthLargestHooks {
  /** 扫描到元素 a[i]，当前堆大小为 heapSize。 */
  onScan?: (index: number, value: number, heapSize: number) => void;
  /** 元素被 push 入堆。给出当前堆内容。 */
  onPush?: (value: number, heap: readonly number[]) => void;
  /** 堆满（size=k）且当前值不大于堆顶，被丢弃。 */
  onSkip?: (value: number, top: number) => void;
  /** 堆顶被弹出、新值入堆（给出被弹出的旧堆顶与入堆的新值）。 */
  onEvict?: (evictedTop: number, newValue: number, heap: readonly number[]) => void;
  /** 完成，给出第 k 大（堆顶）。 */
  onResult?: (value: number, heap: readonly number[]) => void;
}

/** 小顶堆。 */
class MinHeap {
  private readonly a: number[] = [];
  get size(): number {
    return this.a.length;
  }
  peek(): number | undefined {
    return this.a[0];
  }
  snapshot(): number[] {
    return [...this.a];
  }
  push(x: number): void {
    this.a.push(x);
    this.up(this.a.length - 1);
  }
  pop(): number | undefined {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length > 0 && last !== undefined) {
      this.a[0] = last;
      this.down(0);
    }
    return top;
  }
  private up(i: number): void {
    const x = this.a[i]!;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p]! > x) {
        this.a[i] = this.a[p]!;
        i = p;
      } else break;
    }
    this.a[i] = x;
  }
  private down(i: number): void {
    const n = this.a.length;
    const x = this.a[i]!;
    while (true) {
      const l = i * 2 + 1;
      const r = l + 1;
      let best = i;
      let bestV = x;
      if (l < n && this.a[l]! < bestV) {
        best = l;
        bestV = this.a[l]!;
      }
      if (r < n && this.a[r]! < bestV) {
        best = r;
        bestV = this.a[r]!;
      }
      if (best === i) break;
      this.a[i] = this.a[best]!;
      i = best;
    }
    this.a[i] = x;
  }
}

/**
 * 找数组中第 k 大（1-based）。
 * @param arr 输入数组（不修改）
 * @param k 排名（1-based，1 = 最大）
 * @param hooks 可选事件钩子
 * @returns 第 k 大的值
 */
export function kthLargest(arr: readonly number[], k: number, hooks: KthLargestHooks = {}): number {
  if (k < 1) throw new RangeError(`k 必须 >=1，收到 ${k}`);
  if (k > arr.length) throw new RangeError(`k 超出数组长度: ${k} > ${arr.length}`);

  const heap = new MinHeap();
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i]!;
    hooks.onScan?.(i, v, heap.size);
    if (heap.size < k) {
      heap.push(v);
      hooks.onPush?.(v, heap.snapshot());
    } else {
      const top = heap.peek()!;
      if (v > top) {
        const evicted = heap.pop()!;
        heap.push(v);
        hooks.onEvict?.(evicted, v, heap.snapshot());
      } else {
        hooks.onSkip?.(v, top);
      }
    }
  }

  const result = heap.peek()!;
  hooks.onResult?.(result, heap.snapshot());
  return result;
}
