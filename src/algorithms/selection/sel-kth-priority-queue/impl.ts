// 优先队列第 k 小 · 实现

export interface KpHooks {
  onPop?: (value: number, popIndex: number) => void;
}

class MinHeap {
  private a: number[] = [];
  constructor(items: number[] = []) {
    this.a = [...items];
    // 建堆 O(n)
    for (let i = (this.a.length >> 1) - 1; i >= 0; i--) this.down(i);
  }
  size(): number {
    return this.a.length;
  }
  top(): number {
    return this.a[0]!;
  }
  pop(): number {
    const top = this.a[0]!;
    const last = this.a.pop()!;
    if (this.a.length > 0) {
      this.a[0] = last;
      this.down(0);
    }
    return top;
  }
  private down(i: number): void {
    const n = this.a.length;
    while (true) {
      const l = 2 * i + 1,
        r = 2 * i + 2;
      let best = i;
      if (l < n && this.a[l]! < this.a[best]!) best = l;
      if (r < n && this.a[r]! < this.a[best]!) best = r;
      if (best === i) break;
      [this.a[i], this.a[best]] = [this.a[best]!, this.a[i]!];
      i = best;
    }
  }
}

/** 用优先队列选第 k 小（1-based k）。不改原数组。 */
export function kthViaPriorityQueue(
  input: readonly number[],
  k: number,
  hooks: KpHooks = {},
): number {
  if (k < 1 || k > input.length) throw new RangeError(`k=${k} 越界 [1,${input.length}]`);
  const heap = new MinHeap([...input]);
  let result = heap.top();
  for (let i = 1; i <= k; i++) {
    result = heap.pop();
    hooks.onPop?.(result, i);
  }
  return result;
}

/** 弹出前 k 小（升序）。 */
export function firstKSorted(input: readonly number[], k: number): number[] {
  if (k < 0 || k > input.length) throw new RangeError(`k=${k}`);
  const heap = new MinHeap([...input]);
  const out: number[] = [];
  for (let i = 0; i < k; i++) out.push(heap.pop());
  return out;
}
