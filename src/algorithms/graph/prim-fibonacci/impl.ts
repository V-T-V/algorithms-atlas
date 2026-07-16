// =============================================================================
// Prim · Fibonacci 堆实现
// 教学版 Fibonacci 堆：O(1) 摊还 insert/decrease-key，O(log n) 摊还 extract-min。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  source?: string;
}

export interface PrimHooks {
  onExtract?: (v: string, key: number) => void;
  onDecrease?: (u: string, v: string, newKey: number) => void;
  onResult?: (
    totalWeight: number,
    mstEdges: Array<{ from: string; to: string; weight: number }>,
  ) => void;
}

export interface PrimResult {
  totalWeight: number;
  mstEdges: Array<{ from: string; to: string; weight: number }>;
}

interface FibNode {
  id: string;
  key: number;
  parent: FibNode | null;
  child: FibNode | null;
  left: FibNode;
  right: FibNode;
  degree: number;
  mark: boolean;
  /** 在 Prim 中标记是否已确定。 */
  inTree: boolean;
}

/** 教学版 Fibonacci 最小堆（仅支持本算法需要的操作）。 */
class FibonacciHeap {
  private min: FibNode | null = null;
  private index = new Map<string, FibNode>();
  /** 总操作计数（摊还分析用）。 */
  ops = 0;

  size(): number {
    return this.index.size;
  }

  insert(id: string, key: number): FibNode {
    const node: FibNode = {
      id,
      key,
      parent: null,
      child: null,
      degree: 0,
      mark: false,
      inTree: false,
      left: null as unknown as FibNode,
      right: null as unknown as FibNode,
    };
    node.left = node;
    node.right = node;
    this.index.set(id, node);
    this.min = this.mergeIntoRootList(this.min, node);
    this.ops++;
    return node;
  }

  has(id: string): boolean {
    return this.index.has(id);
  }

  getNode(id: string): FibNode | undefined {
    return this.index.get(id);
  }

  extractMin(): FibNode | null {
    const z = this.min;
    if (!z) return null;
    // 将 z 的孩子提升到根链表
    if (z.child) {
      let c = z.child!;
      const children: FibNode[] = [];
      do {
        children.push(c);
        c = c.right;
      } while (c !== z.child);
      for (const ch of children) {
        ch.parent = null;
        this.min = this.mergeIntoRootList(this.min, ch);
      }
      z.child = null;
    }
    // 从根链表移除 z
    z.left.right = z.right;
    z.right.left = z.left;
    if (z === z.right) {
      this.min = null;
    } else {
      this.min = z.right;
      this.consolidate();
    }
    this.index.delete(z.id);
    this.ops++;
    return z;
  }

  decreaseKey(node: FibNode, newKey: number): void {
    if (newKey >= node.key) return;
    node.key = newKey;
    const parent = node.parent;
    if (parent && node.key < parent.key) {
      this.cut(node, parent);
      this.cascadingCut(parent);
    }
    if (node.key < (this.min?.key ?? Infinity)) this.min = node;
    this.ops++;
  }

  private mergeIntoRootList(a: FibNode | null, b: FibNode): FibNode | null {
    if (!a) return b;
    // 把 b 插入 a 的环状根链表
    const aRight = a.right;
    a.right = b;
    b.left.right = aRight;
    aRight.left = b.left;
    b.left = a;
    return a.key <= b.key ? a : b;
  }

  private cut(node: FibNode, parent: FibNode): void {
    // 从父的孩子链表中移除 node
    if (node.right === node) {
      parent.child = null;
    } else {
      node.left.right = node.right;
      node.right.left = node.left;
      if (parent.child === node) parent.child = node.right;
    }
    parent.degree--;
    node.parent = null;
    node.mark = false;
    // 加入根链表
    node.left = node;
    node.right = node;
    this.min = this.mergeIntoRootList(this.min, node);
  }

  private cascadingCut(node: FibNode): void {
    const parent = node.parent;
    if (parent) {
      if (!node.mark) {
        node.mark = true;
      } else {
        this.cut(node, parent);
        this.cascadingCut(parent);
      }
    }
  }

  private consolidate(): void {
    const maxDegree = Math.ceil(Math.log2(this.index.size + 1)) + 2;
    const A: Array<FibNode | null> = new Array(maxDegree + 1).fill(null);
    // 收集根链表
    if (!this.min) return;
    const roots: FibNode[] = [];
    const start = this.min;
    let cur = start;
    do {
      roots.push(cur);
      cur = cur.right;
    } while (cur !== start);

    for (const w of roots) {
      let x = w;
      let d = x.degree;
      while (d < A.length && A[d] !== null) {
        let y = A[d]!;
        if (x.key > y.key) {
          const tmp = x;
          x = y;
          y = tmp;
        }
        // 把 y 挂到 x 下
        y.left.right = y.right;
        y.right.left = y.left;
        y.parent = x;
        if (!x.child) {
          x.child = y;
          y.left = y;
          y.right = y;
        } else {
          this.mergeIntoRootList(x.child, y);
          x.child = x.child.key <= y.key ? x.child : y;
        }
        x.degree++;
        y.mark = false;
        A[d] = null;
        d++;
        if (d >= A.length) A.push(null);
      }
      A[d] = x;
    }
    // 重建根链表
    this.min = null;
    for (const node of A) {
      if (node) {
        node.left = node;
        node.right = node;
        node.parent = null;
        this.min = this.mergeIntoRootList(this.min, node);
      }
    }
  }
}

export function primFibonacci(input: GraphInput, hooks: PrimHooks = {}): PrimResult {
  const { nodes, edges } = input;
  const source = input.source ?? nodes[0] ?? '';

  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (adj.has(e.from)) adj.get(e.from)!.push({ to: e.to, w: e.weight });
    if (adj.has(e.to)) adj.get(e.to)!.push({ to: e.from, w: e.weight });
  }

  const heap = new FibonacciHeap();
  const key = new Map<string, number>();
  const prev = new Map<string, string | null>();
  for (const n of nodes) {
    key.set(n, Infinity);
    prev.set(n, null);
  }
  if (!key.has(source)) {
    hooks.onResult?.(0, []);
    return { totalWeight: 0, mstEdges: [] };
  }
  key.set(source, 0);
  for (const n of nodes) heap.insert(n, key.get(n) ?? Infinity);

  const inTree = new Set<string>();
  const mst: Array<{ from: string; to: string; weight: number }> = [];
  let total = 0;

  while (heap.size() > 0) {
    const u = heap.extractMin()!;
    // 不可达节点（key 仍为 ∞）：图不连通，跳过
    if (u.key === Infinity) {
      inTree.add(u.id);
      u.inTree = true;
      hooks.onExtract?.(u.id, u.key);
      continue;
    }
    inTree.add(u.id);
    u.inTree = true;
    hooks.onExtract?.(u.id, u.key);
    const p = prev.get(u.id);
    if (p) {
      mst.push({ from: p, to: u.id, weight: u.key });
      total += u.key;
    }
    for (const { to: v, w } of adj.get(u.id) ?? []) {
      if (inTree.has(v)) continue;
      if (w < (key.get(v) ?? Infinity)) {
        key.set(v, w);
        prev.set(v, u.id);
        const node = heap.getNode(v);
        if (node) {
          heap.decreaseKey(node, w);
          hooks.onDecrease?.(u.id, v, w);
        }
      }
    }
  }

  hooks.onResult?.(total, mst);
  return { totalWeight: total, mstEdges: mst };
}
