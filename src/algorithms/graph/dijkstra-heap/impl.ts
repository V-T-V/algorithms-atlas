// =============================================================================
// Dijkstra · 二叉堆优化（非负权单源最短路）
// 标准数组实现的二叉小顶堆（下标 1 起），懒删除过期条目。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  source?: string;
}

export interface DijkstraHooks {
  onRelax?: (u: string, v: string, newDist: number) => void;
  onSettle?: (v: string, dist: number) => void;
  onResult?: (dist: Map<string, number>, prev: Map<string, string | null>) => void;
}

export interface DijkstraResult {
  dist: Map<string, number>;
  prev: Map<string, string | null>;
}

/** 二叉小顶堆，元素为 [距离, 节点]。下标 1 起。 */
class MinHeap {
  private heap: Array<[number, string]> = [[-1, '__placeholder__']]; // 占位 [0]，有效元素从 1 开始
  get size(): number {
    return this.heap.length - 1;
  }
  push(x: [number, string]): void {
    this.heap.push(x);
    this.siftUp(this.heap.length - 1);
  }
  pop(): [number, string] | undefined {
    if (this.size === 0) return undefined;
    const top = this.heap[1]!;
    const last = this.heap.pop()!;
    if (this.size > 0) {
      this.heap[1] = last;
      this.siftDown(1);
    }
    return top;
  }
  private siftUp(i: number): void {
    let k = i;
    while (k > 1) {
      const parent = k >> 1;
      if (this.heap[k]![0] < this.heap[parent]![0]) {
        [this.heap[k], this.heap[parent]] = [this.heap[parent]!, this.heap[k]!];
        k = parent;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.size;
    let k = i;
    while (true) {
      const l = k << 1;
      const r = l + 1;
      let smallest = k;
      if (l <= n && this.heap[l]![0] < this.heap[smallest]![0]) smallest = l;
      if (r <= n && this.heap[r]![0] < this.heap[smallest]![0]) smallest = r;
      if (smallest === k) break;
      [this.heap[k], this.heap[smallest]] = [this.heap[smallest]!, this.heap[k]!];
      k = smallest;
    }
  }
}

export function dijkstraHeap(input: GraphInput, hooks: DijkstraHooks = {}): DijkstraResult {
  const { nodes, edges } = input;
  const source = input.source ?? nodes[0] ?? '';

  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push({ to: e.to, w: e.weight });
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const settled = new Set<string>();
  const INF = Infinity;
  for (const n of nodes) {
    dist.set(n, INF);
    prev.set(n, null);
  }
  if (!dist.has(source)) {
    hooks.onResult?.(dist, prev);
    return { dist, prev };
  }
  dist.set(source, 0);

  const heap = new MinHeap();
  heap.push([0, source]);

  while (heap.size > 0) {
    const [d, u] = heap.pop()!;
    if (settled.has(u)) continue; // 懒删除过期条目
    settled.add(u);
    hooks.onSettle?.(u, d);
    for (const { to: v, w } of adj.get(u) ?? []) {
      if (settled.has(v)) continue;
      const nd = d + w;
      if (nd < (dist.get(v) ?? INF)) {
        dist.set(v, nd);
        prev.set(v, u);
        heap.push([nd, v]);
        hooks.onRelax?.(u, v, nd);
      }
    }
  }

  hooks.onResult?.(dist, prev);
  return { dist, prev };
}
