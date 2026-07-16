// =============================================================================
// 二项堆 Binomial Heap · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：最小二项堆。由一组「二项树」组成的森林，每棵 B_k 有 2^k 个节点。
//   - merge/union：把度数相同的二项树合并，类似二进制进位。
//   - insert：构造单节点 B_0，再 union。
//   - findMin：扫描森林根表 O(log n)（可优化为 O(1)，本实现扫描以利可视化）。
//   - extractMin：删除最小根，把其子树（仍为二项树）反序后并回森林。
//   - 摊还 / 实际复杂度：insert O(log n)，extractMin O(log n)，union O(log n)。
// =============================================================================

/** 二项树节点。 */
export class BinomialNode {
  value: number;
  /** 子树度数（即 children 长度），等于二项树的阶 k。 */
  children: BinomialNode[] = [];
  parent: BinomialNode | null = null;
  constructor(value: number) {
    this.value = value;
  }
  get degree(): number {
    return this.children.length;
  }
}

/** 二项堆操作过程中的事件钩子。任一可选。 */
export interface BinomialHeapHooks {
  /** 合并两棵同阶二项树：winner.value, loser.value。winner 为根。 */
  onLink?: (winnerValue: number, loserValue: number) => void;
  /** 插入新值。 */
  onInsert?: (value: number) => void;
  /** 弹出最小值。 */
  onExtract?: (value: number) => void;
}

/**
 * 最小二项堆。
 * 内部维护根表（forest），每棵是 B_k，k 严格递增。
 */
export class BinomialHeap {
  /** 根表（按度数升序）。 */
  private forest: BinomialNode[] = [];
  private count = 0;

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 把度数相同的两棵二项树合并：较小者为根，较大者作为其最左子。 */
  private link(a: BinomialNode, b: BinomialNode, hooks: BinomialHeapHooks): BinomialNode {
    // a、b 同阶；保证 a.value <= b.value（最小堆）
    let winner = a;
    let loser = b;
    if (b.value < a.value) {
      winner = b;
      loser = a;
    }
    loser.parent = winner;
    // 子树按度数降序插入头部（保持 B_k 子树为 B_{k-1},...,B_0）
    winner.children.unshift(loser);
    hooks.onLink?.(winner.value, loser.value);
    return winner;
  }

  /** 合并两个森林（度数升序），返回新森林（可能含同阶未合并项）。 */
  private mergeForest(a: BinomialNode[], b: BinomialNode[]): BinomialNode[] {
    const out: BinomialNode[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i]!.degree <= b[j]!.degree) {
        out.push(a[i]!);
        i++;
      } else {
        out.push(b[j]!);
        j++;
      }
    }
    while (i < a.length) {
      out.push(a[i]!);
      i++;
    }
    while (j < b.length) {
      out.push(b[j]!);
      j++;
    }
    return out;
  }

  /** 对森林做「二进制进位」合并：消除同阶二项树。 */
  private union(forest: BinomialNode[], hooks: BinomialHeapHooks): BinomialNode[] {
    if (forest.length <= 1) return forest;
    const out: BinomialNode[] = [];
    let i = 0;
    while (i < forest.length) {
      const cur = forest[i]!;
      const next = forest[i + 1];
      if (next === undefined) {
        out.push(cur);
        i++;
        continue;
      }
      if (cur.degree !== next.degree) {
        out.push(cur);
        i++;
        continue;
      }
      // 同阶：先看后面是否还有同阶（三连）
      const after = forest[i + 2];
      if (after !== undefined && after.degree === next.degree) {
        // 三棵同阶：先输出 cur，下一轮合并 next 与 after
        out.push(cur);
        i++;
        continue;
      }
      // 合并 cur 与 next
      const merged = this.link(cur, next, hooks);
      forest[i] = merged;
      forest.splice(i + 1, 1);
      // 不前进 i，可能合并后又与后续同阶
    }
    return out;
  }

  /** 插入值：构造 B_0 并入森林。 */
  insert(value: number, hooks: BinomialHeapHooks = {}): void {
    const node = new BinomialNode(value);
    const merged = this.mergeForest(this.forest, [node]);
    this.forest = this.union(merged, hooks);
    this.count++;
    hooks.onInsert?.(value);
  }

  /** 查看最小值（不弹出）。 */
  findMin(): number | undefined {
    if (this.forest.length === 0) return undefined;
    let min = this.forest[0]!.value;
    for (const r of this.forest) if (r.value < min) min = r.value;
    return min;
  }

  /** 找到最小根在 forest 中的下标。 */
  private minIndex(): number {
    let mi = 0;
    for (let i = 1; i < this.forest.length; i++) {
      if (this.forest[i]!.value < this.forest[mi]!.value) mi = i;
    }
    return mi;
  }

  /** 弹出最小值：取最小根，其子树反序后并入森林。 */
  extractMin(hooks: BinomialHeapHooks = {}): number | undefined {
    if (this.forest.length === 0) return undefined;
    const mi = this.minIndex();
    const minNode = this.forest[mi]!;
    // 从 forest 移除
    this.forest.splice(mi, 1);
    // 子树：反序后度数升序（B_{k-1}..B_0 → 升序）
    const children = minNode.children.slice().reverse();
    for (const c of children) c.parent = null;
    const merged = this.mergeForest(this.forest, children);
    this.forest = this.union(merged, hooks);
    this.count--;
    hooks.onExtract?.(minNode.value);
    return minNode.value;
  }

  /** 把另一堆合并进本堆（other 被清空）。 */
  meld(other: BinomialHeap, hooks: BinomialHeapHooks = {}): void {
    const merged = this.mergeForest(this.forest, other.forest);
    this.forest = this.union(merged, hooks);
    this.count += other.count;
    other.forest = [];
    other.count = 0;
  }

  /** 当前森林根表（用于渲染/断言）。 */
  roots(): BinomialNode[] {
    return [...this.forest];
  }
}

/**
 * 便利函数：批量插入构造二项堆，返回实例。
 */
export function binaryHeap2(
  values: readonly number[],
  hooks: BinomialHeapHooks = {},
): BinomialHeap {
  const h = new BinomialHeap();
  for (const v of values) h.insert(v, hooks);
  return h;
}
