// =============================================================================
// 可降键优先队列（索引最小堆）· 纯算法实现
// =============================================================================

export interface IndexedHeapHooks {
  onSiftUp?: (pos: number, id: number) => void;
  onSiftDown?: (pos: number, id: number) => void;
  onPush?: (id: number, prio: number) => void;
  onPop?: (id: number, prio: number) => void;
  onDecreaseKey?: (id: number, oldPrio: number, newPrio: number) => void;
}

interface Entry {
  id: number;
  prio: number;
}

export class IndexedMinHeap {
  private heap: Entry[] = [];
  private pos = new Map<number, number>(); // id -> 堆中下标
  private hooks: IndexedHeapHooks;

  constructor(hooks: IndexedHeapHooks = {}) {
    this.hooks = hooks;
  }

  get size(): number {
    return this.heap.length;
  }

  has(id: number): boolean {
    return this.pos.has(id);
  }

  getPrio(id: number): number | undefined {
    const p = this.pos.get(id);
    return p === undefined ? undefined : this.heap[p]!.prio;
  }

  push(id: number, prio: number): void {
    if (this.pos.has(id)) throw new Error(`id ${id} already exists`);
    const pos = this.heap.length;
    this.heap.push({ id, prio });
    this.pos.set(id, pos);
    this.hooks.onPush?.(id, prio);
    this.siftUp(pos);
  }

  pop(): { id: number; prio: number } | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0]!;
    this.hooks.onPop?.(top.id, top.prio);
    const last = this.heap.pop()!;
    this.pos.delete(top.id);
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.pos.set(last.id, 0);
      this.siftDown(0);
    }
    return top;
  }

  peek(): { id: number; prio: number } | undefined {
    return this.heap.length === 0 ? undefined : this.heap[0];
  }

  /** 把 id 的优先级改为 newPrio（必须更小）。 */
  decreaseKey(id: number, newPrio: number): void {
    const p = this.pos.get(id);
    if (p === undefined) throw new Error(`id ${id} not found`);
    const old = this.heap[p]!.prio;
    if (newPrio > old) throw new Error('decreaseKey: newPrio larger than current');
    this.hooks.onDecreaseKey?.(id, old, newPrio);
    this.heap[p]!.prio = newPrio;
    this.siftUp(p);
  }

  private siftUp(p: number): void {
    while (p > 0) {
      const parent = (p - 1) >> 1;
      if (this.heap[p]!.prio < this.heap[parent]!.prio) {
        this.swap(p, parent);
        this.hooks.onSiftUp?.(parent, this.heap[parent]!.id);
        p = parent;
      } else break;
    }
  }

  private siftDown(p: number): void {
    const n = this.heap.length;
    while (true) {
      const l = 2 * p + 1;
      const r = 2 * p + 2;
      let best = p;
      if (l < n && this.heap[l]!.prio < this.heap[best]!.prio) best = l;
      if (r < n && this.heap[r]!.prio < this.heap[best]!.prio) best = r;
      if (best === p) break;
      this.swap(p, best);
      this.hooks.onSiftDown?.(best, this.heap[best]!.id);
      p = best;
    }
  }

  private swap(a: number, b: number): void {
    const t = this.heap[a]!;
    this.heap[a] = this.heap[b]!;
    this.heap[b] = t;
    this.pos.set(this.heap[a]!.id, a);
    this.pos.set(this.heap[b]!.id, b);
  }
}
