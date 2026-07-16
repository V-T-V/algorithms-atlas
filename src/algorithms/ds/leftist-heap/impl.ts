// =============================================================================
// 左偏树 Leftist Heap（可并堆）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：最小左偏树。每个节点维护 s(dist) = 到最近外null 的距离。
//   - 性质：node.s = 1 + min(s(left), s(right))；且 s(left) ≥ s(right)。
//   - merge(a,b)：递归把较大根的堆与较小根堆的右子合并，再按 s 调换左右。
//   - insert = merge(单节点)。
//   - extractMin = merge(left, right)。
//   - merge / insert / extractMin 均 O(log n)；m 等价于两个堆 merge，O(log n)。
// =============================================================================

/** 左偏树节点。 */
export class LeftistNode {
  value: number;
  left: LeftistNode | null = null;
  right: LeftistNode | null = null;
  /** s 值：到最近「外空节点」的距离。单节点 s = 1。 */
  s = 1;
  constructor(value: number) {
    this.value = value;
  }
}

function dist(n: LeftistNode | null): number {
  return n ? n.s : 0;
}

/** 左偏树操作过程中的事件钩子。任一可选。 */
export interface LeftistHooks {
  /** merge 过程中比较两根，winner 为较小根值。 */
  onCompare?: (aValue: number, bValue: number, winner: number) => void;
  /** 发生左右子交换（按 s 调整）。 */
  onSwap?: (nodeValue: number) => void;
  /** 插入新值。 */
  onInsert?: (value: number) => void;
  /** 弹出最小值。 */
  onExtract?: (value: number) => void;
}

/**
 * 最小左偏树（可并堆）。
 */
export class LeftistHeap {
  /** 根节点。 */
  root: LeftistNode | null = null;
  private count = 0;

  get size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 递归合并两棵左偏树，返回新根。 */
  private merge(
    a: LeftistNode | null,
    b: LeftistNode | null,
    hooks: LeftistHooks,
  ): LeftistNode | null {
    if (a === null) return b;
    if (b === null) return a;
    // 保证 a 为较小根
    if (a.value > b.value) {
      const t = a;
      a = b;
      b = t;
    }
    hooks.onCompare?.(a.value, b.value, a.value);
    // 把 b 合并到 a 的右子
    a.right = this.merge(a.right, b, hooks);
    // 维持左偏性质：s(left) ≥ s(right)
    if (dist(a.left) < dist(a.right)) {
      const tmp = a.left;
      a.left = a.right;
      a.right = tmp;
      hooks.onSwap?.(a.value);
    }
    a.s = dist(a.right) + 1;
    return a;
  }

  /** 插入值：merge 单节点。 */
  insert(value: number, hooks: LeftistHooks = {}): void {
    const node = new LeftistNode(value);
    this.root = this.merge(this.root, node, hooks);
    this.count++;
    hooks.onInsert?.(value);
  }

  /** 查看最小值（根）。 */
  findMin(): number | undefined {
    return this.root?.value;
  }

  /** 弹出最小值：合并左右子树。 */
  extractMin(hooks: LeftistHooks = {}): number | undefined {
    if (this.root === null) return undefined;
    const minVal = this.root.value;
    this.root = this.merge(this.root.left, this.root.right, hooks);
    this.count--;
    hooks.onExtract?.(minVal);
    return minVal;
  }

  /** 把另一堆合并进本堆（other 被清空）。 */
  meld(other: LeftistHeap, hooks: LeftistHooks = {}): void {
    this.root = this.merge(this.root, other.root, hooks);
    this.count += other.count;
    other.root = null;
    other.count = 0;
  }

  /** 校验左偏性质（s(left) ≥ s(right) 且 s 正确）。 */
  isValid(): boolean {
    const check = (n: LeftistNode | null): number => {
      if (!n) return 0;
      const ls = check(n.left);
      const rs = check(n.right);
      if (ls < 0 || rs < 0) return -1;
      if (ls < rs) return -1; // 左偏性质
      const expected = rs + 1;
      if (n.s !== expected) return -1;
      // 堆序：父 ≤ 子
      if (n.left && n.left.value < n.value) return -1;
      if (n.right && n.right.value < n.value) return -1;
      return expected;
    };
    return check(this.root) >= 0;
  }
}

/**
 * 便利函数：批量插入构造左偏树，返回实例。
 */
export function leftistHeap(values: readonly number[], hooks: LeftistHooks = {}): LeftistHeap {
  const h = new LeftistHeap();
  for (const v of values) h.insert(v, hooks);
  return h;
}
