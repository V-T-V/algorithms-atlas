// =============================================================================
// 配对堆 Pairing Heap · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：最小配对堆。树形结构，每个节点维护子节点链表（兄弟链）。
//   - meld(a,b)：较小根作为父，较大者挂为其最左子（first-child / next-sibling）。
//   - insert = meld(单节点)。
//   - findMin = root。
//   - extractMin：删根，把根的孩子们「两两配对」merge，再从左到右合并剩余。
//     两两 pass：把相邻兄弟对 meld 得到一组子树；再 left-to-right pass 把它们 meld 成一棵。
//   - 摊还 O(log n)（实验上接近 O(1)），结构极简；虽然理论最坏复杂度仍未定论。
// =============================================================================

/** 配对堆节点（first-child / next-sibling 表示）。 */
export class PairingNode {
  value: number;
  /** 最左子节点。 */
  child: PairingNode | null = null;
  /** 右兄弟（同一父下）。 */
  sibling: PairingNode | null = null;
  /** 父节点（用于 cut）。 */
  parent: PairingNode | null = null;
  constructor(value: number) {
    this.value = value;
  }
}

/** 配对堆操作过程中的事件钩子。任一可选。 */
export interface PairingHooks {
  /** meld：winner 作为父，loser 作为其子。 */
  onMeld?: (winnerValue: number, loserValue: number) => void;
  /** insert 新值。 */
  onInsert?: (value: number) => void;
  /** 弹出最小值。 */
  onExtract?: (value: number) => void;
  /** 一次「配对 pass」开始（子节点数）。 */
  onPairPass?: (childCount: number) => void;
}

/**
 * 最小配对堆。
 */
export class PairingHeap {
  /** 根节点。 */
  root: PairingNode | null = null;
  private count = 0;

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 把 b 挂为 a 的最左子（维护 sibling 链）。 */
  private attach(a: PairingNode, b: PairingNode): void {
    b.sibling = a.child;
    b.parent = a;
    a.child = b;
  }

  /** meld 两棵：较小根为父。返回新根。 */
  private meld(
    a: PairingNode | null,
    b: PairingNode | null,
    hooks: PairingHooks,
  ): PairingNode | null {
    if (a === null) return b;
    if (b === null) return a;
    // 清掉顶层 parent/sibling（它们已是独立子树根）
    a.sibling = null;
    a.parent = null;
    b.sibling = null;
    b.parent = null;
    if (a.value <= b.value) {
      this.attach(a, b);
      hooks.onMeld?.(a.value, b.value);
      return a;
    }
    this.attach(b, a);
    hooks.onMeld?.(b.value, a.value);
    return b;
  }

  /** 插入值：meld 单节点。 */
  insert(value: number, hooks: PairingHooks = {}): void {
    const node = new PairingNode(value);
    this.root = this.meld(this.root, node, hooks);
    this.count++;
    hooks.onInsert?.(value);
  }

  /** 查看最小值（根）。 */
  findMin(): number | undefined {
    return this.root?.value;
  }

  /** extractMin：删根，对子链做两两配对 + 左到右合并。 */
  extractMin(hooks: PairingHooks = {}): number | undefined {
    if (this.root === null) return undefined;
    const minVal = this.root.value;
    const firstChild = this.root.child;
    // 收集子节点链
    const children: PairingNode[] = [];
    let cur = firstChild;
    while (cur !== null) {
      const next = cur.sibling;
      cur.sibling = null;
      cur.parent = null;
      children.push(cur);
      cur = next;
    }
    hooks.onPairPass?.(children.length);
    // 第一遍：相邻两两 meld
    const paired: PairingNode[] = [];
    for (let i = 0; i < children.length; i += 2) {
      const a = children[i]!;
      const b = i + 1 < children.length ? children[i + 1]! : null;
      paired.push(this.meld(a, b, hooks)!);
    }
    // 第二遍：从右到左 meld（等价于 left-to-right 累积）
    let newRoot: PairingNode | null = null;
    for (let i = paired.length - 1; i >= 0; i--) {
      newRoot = this.meld(newRoot, paired[i]!, hooks);
    }
    this.root = newRoot;
    this.count--;
    hooks.onExtract?.(minVal);
    return minVal;
  }

  /** 把另一堆合并进本堆（other 被清空）。 */
  meldHeap(other: PairingHeap, hooks: PairingHooks = {}): void {
    this.root = this.meld(this.root, other.root, hooks);
    this.count += other.count;
    other.root = null;
    other.count = 0;
  }

  /** 校验堆序（父 ≤ 子，沿 child/sibling 链）。 */
  isValid(): boolean {
    const check = (n: PairingNode | null): boolean => {
      if (!n) return true;
      let c = n.child;
      while (c) {
        if (c.value < n.value) return false;
        if (!check(c)) return false;
        c = c.sibling;
      }
      return true;
    };
    return check(this.root);
  }
}

/**
 * 便利函数：批量插入构造配对堆，返回实例。
 */
export function pairingHeap(values: readonly number[], hooks: PairingHooks = {}): PairingHeap {
  const h = new PairingHeap();
  for (const v of values) h.insert(v, hooks);
  return h;
}
