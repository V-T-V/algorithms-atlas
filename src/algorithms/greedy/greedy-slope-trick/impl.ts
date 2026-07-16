// Slope Trick (Make sequence non-decreasing, cost = sum |a_i - b_i|) · 实现
export interface StHooks {
  onOp?: (i: number, x: number, pqTop: number) => void;
  onConclude?: (cost: number) => void;
}
export function slopeTrick(a: readonly number[], hooks: StHooks = {}): number {
  // 维护最大堆 (用负数模拟)
  const heap = new MaxHeap();
  let cost = 0;
  for (let i = 0; i < a.length; i++) {
    heap.push(a[i]!);
    hooks.onOp?.(i, a[i]!, heap.top());
    if (heap.top() > a[i]!) {
      const t = heap.pop()!;
      cost += t - a[i]!;
      heap.push(a[i]!);
    }
  }
  hooks.onConclude?.(cost);
  return cost;
}
class MaxHeap {
  private h: number[] = [];
  push(v: number) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p]! >= this.h[i]!) break;
      [this.h[p], this.h[i]] = [this.h[i]!, this.h[p]!];
      i = p;
    }
  }
  pop(): number | undefined {
    const r = this.h[0];
    const last = this.h.pop()!;
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      for (;;) {
        let c = 2 * i + 1;
        if (c + 1 < this.h.length && this.h[c + 1]! > this.h[c]!) c++;
        if (c >= this.h.length || this.h[i]! >= this.h[c]!) break;
        [this.h[i], this.h[c]] = [this.h[c]!, this.h[i]!];
        i = c;
      }
    }
    return r;
  }
  top(): number {
    return this.h[0] ?? -Infinity;
  }
}
