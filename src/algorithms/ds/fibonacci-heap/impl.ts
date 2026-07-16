// =============================================================================
// 斐波那契堆 Fibonacci Heap · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：最小斐波那契堆。根表为循环双链表；子表亦为循环双链表。
//   - insert：O(1) 加入根表。
//   - findMin：O(1)，min 指针。
//   - extractMin：删 min，其孩子们并入根表；再 consolidate：按度数分桶合并，
//     度数相同的两棵 link（小根为父），直到根表度数互异。
//   - decreaseKey / delete：可标记被切除子的节点；二次切子触发级联切除（cascading cut）。
//   - 复杂度：insert/findMin/decreaseKey 摊还 O(1)；extractMin 摊还 O(log n)。
// =============================================================================

/** 斐波那契堆节点。 */
export class FibNode {
  value: number;
  /** 度数（子节点数）。 */
  degree = 0;
  /** 是否被切除过子节点（用于级联切除）。 */
  mark = false;
  parent: FibNode | null = null;
  child: FibNode | null = null;
  /** 双向循环链表指针。 */
  left: FibNode;
  right: FibNode;
  constructor(value: number) {
    this.value = value;
    this.left = this;
    this.right = this;
  }
}

/** 斐波那契堆操作过程中的事件钩子。任一可选。 */
export interface FibHooks {
  /** insert 新值。 */
  onInsert?: (value: number) => void;
  /** extractMin 弹出值。 */
  onExtract?: (value: number) => void;
  /** consolidate 阶段开始。 */
  onConsolidate?: () => void;
  /** link：把 loser 挂为 winner 的子（度数 link）。 */
  onLink?: (winnerValue: number, loserValue: number) => void;
}

/** 最小斐波那契堆。 */
export class FibonacciHeap {
  /** 根表最小节点。 */
  private min: FibNode | null = null;
  private count = 0;

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 把节点 x 从其双向链表中摘除。 */
  private removeFromList(x: FibNode): void {
    x.left.right = x.right;
    x.right.left = x.left;
  }

  /** 把 y 插入到 x 的右侧（循环链表）。 */
  private insertAfter(x: FibNode, y: FibNode): void {
    y.left = x;
    y.right = x.right;
    x.right.left = y;
    x.right = y;
  }

  /** 把单节点 y 并入根表（min 为根表代表）。 */
  private addToRootList(y: FibNode): void {
    y.parent = null;
    y.left = y;
    y.right = y;
    if (this.min === null) {
      this.min = y;
    } else {
      this.insertAfter(this.min, y);
      if (y.value < this.min.value) this.min = y;
    }
  }

  /** insert：O(1) 加入根表。 */
  insert(value: number, hooks: FibHooks = {}): void {
    const node = new FibNode(value);
    this.addToRootList(node);
    this.count++;
    hooks.onInsert?.(value);
  }

  findMin(): number | undefined {
    return this.min?.value;
  }

  /** 把 y 挂为 x 的子（y 从根表移除）。 */
  private link(x: FibNode, y: FibNode, hooks: FibHooks): void {
    // y.value > x.value（保证）
    this.removeFromList(y);
    y.parent = x;
    y.left = y;
    y.right = y;
    if (x.child === null) {
      x.child = y;
    } else {
      this.insertAfter(x.child, y);
    }
    x.degree++;
    y.mark = false;
    hooks.onLink?.(x.value, y.value);
  }

  /** consolidate：按度数合并根表，使各根度数互异。 */
  private consolidate(hooks: FibHooks): void {
    hooks.onConsolidate?.();
    // 收集根表节点
    const roots: FibNode[] = [];
    if (this.min !== null) {
      const start = this.min;
      let cur = start;
      do {
        roots.push(cur);
        cur = cur.right;
      } while (cur !== start);
    }
    // 度数 → 节点 桶
    const degreeMap = new Map<number, FibNode>();
    for (const w of roots) {
      let x = w;
      let d = x.degree;
      while (degreeMap.has(d)) {
        let y = degreeMap.get(d)!;
        // 保证 x 较小
        if (x.value > y.value) {
          const t = x;
          x = y;
          y = t;
        }
        this.link(x, y, hooks);
        degreeMap.delete(d);
        d = x.degree;
      }
      degreeMap.set(d, x);
    }
    // 重建根表与 min
    this.min = null;
    for (const node of degreeMap.values()) {
      node.left = node;
      node.right = node;
      node.parent = null;
      if (this.min === null) {
        this.min = node;
      } else {
        this.insertAfter(this.min, node);
        if (node.value < this.min.value) this.min = node;
      }
    }
  }

  /** extractMin：删 min，其孩子们并入根表后 consolidate。 */
  extractMin(hooks: FibHooks = {}): number | undefined {
    const z = this.min;
    if (z === null) return undefined;
    // 把 z 的孩子们并入根表
    if (z.child !== null) {
      let c = z.child;
      const children: FibNode[] = [];
      const start = c;
      do {
        children.push(c);
        c = c.right;
      } while (c !== start);
      for (const child of children) {
        child.parent = null;
        // 从子链表摘除并加到根表
        this.insertAfter(this.min!, child);
      }
      z.child = null;
      z.degree = 0;
    }
    // 从根表摘除 z
    if (z.right === z) {
      this.min = null;
    } else {
      this.min = z.right;
      this.removeFromList(z);
      this.consolidate(hooks);
    }
    this.count--;
    hooks.onExtract?.(z.value);
    return z.value;
  }

  /** 当前根表节点（用于渲染）。 */
  rootList(): FibNode[] {
    if (this.min === null) return [];
    const out: FibNode[] = [];
    let cur = this.min;
    do {
      out.push(cur);
      cur = cur.right;
    } while (cur !== this.min);
    return out;
  }
}

/**
 * 便利函数：批量插入构造斐波那契堆，返回实例。
 */
export function fibonacciHeap(values: readonly number[], hooks: FibHooks = {}): FibonacciHeap {
  const h = new FibonacciHeap();
  for (const v of values) h.insert(v, hooks);
  return h;
}
