// =============================================================================
// B 树（B-Tree）· 纯算法实现
// 自平衡多路搜索树：插入时采用「主动分裂」——下沉时若子节点已满则先分裂，
// 保证父节点总有空位接纳上推的中间关键字。最小度数 t=2 即 2-3-4 树。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步操作供录制器使用。
// =============================================================================

/** B 树节点。keys 升序；children.length === keys.length + 1（叶子 children 为空数组）。 */
export interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  /** 是否叶子。 */
  leaf: boolean;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BTreeHooks {
  /** 开始插入值 value。 */
  onInsert?: (value: number) => void;
  /** 在节点中按二分定位插入位置 idx（value 应落入 keys[idx] 之前）。 */
  onLocate?: (nodeKeys: number[], value: number, idx: number) => void;
  /** 节点已满（2t-1 个关键字），准备分裂。 */
  onSplit?: (fullKeys: number[], midKey: number) => void;
  /** 把中间关键字 midKey 上推到父节点的 pos 位置。 */
  onPromote?: (midKey: number, pos: number) => void;
  /** 值 value 已成功插入。 */
  onInserted?: (value: number) => void;
}

/** B 树封装。 */
export class BTree {
  root: BTreeNode | null;
  readonly t: number;
  /** 节点最大关键字数 = 2t-1。 */
  readonly maxKeys: number;

  constructor(t = 2, hooks: BTreeHooks = {}) {
    this.t = t;
    this.maxKeys = 2 * t - 1;
    this.root = null;
    this.hooks = hooks;
  }

  private hooks: BTreeHooks;

  /** 设置钩子（构造后可换）。 */
  setHooks(hooks: BTreeHooks): void {
    this.hooks = hooks;
  }

  /** 顺序插入多个值。 */
  insertAll(values: readonly number[]): void {
    for (const v of values) this.insert(v);
  }

  /** 插入一个值。 */
  insert(value: number): void {
    this.hooks.onInsert?.(value);
    if (this.root === null) {
      this.root = { keys: [value], children: [], leaf: true };
      this.hooks.onInserted?.(value);
      return;
    }
    // 根已满 → 分裂根，产生新根
    if (this.root.keys.length === this.maxKeys) {
      const newRoot: BTreeNode = { keys: [], children: [this.root], leaf: false };
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this.insertNonFull(this.root, value);
    this.hooks.onInserted?.(value);
  }

  /** 在非满节点 node 中插入 value（保证 node.keys.length < maxKeys）。 */
  private insertNonFull(node: BTreeNode, value: number): void {
    // 二分定位插入位置
    let idx = this.lowerBound(node.keys, value);
    this.hooks.onLocate?.(node.keys, value, idx);

    if (node.leaf) {
      // 叶子：直接插入
      node.keys.splice(idx, 0, value);
      return;
    }
    // 内部节点：若子节点已满则先分裂
    if (node.children[idx]!.keys.length === this.maxKeys) {
      this.splitChild(node, idx);
      // 分裂后 node.keys[idx] 是上推的中间值；决定走左还是右
      if (value > node.keys[idx]!) idx++;
    }
    this.insertNonFull(node.children[idx]!, value);
  }

  /** 分裂 node.children[i]（已满）。中间关键字上推到 node.keys[i]。 */
  private splitChild(parent: BTreeNode, i: number): void {
    const t = this.t;
    const full = parent.children[i]!;
    const midKey = full.keys[t - 1]!;
    this.hooks.onSplit?.(full.keys, midKey);

    // 右半部分作为新节点
    const right: BTreeNode = {
      keys: full.keys.slice(t),
      children: full.children.slice(t),
      leaf: full.leaf,
    };
    // 左半部分留在原节点（截断）
    full.keys = full.keys.slice(0, t - 1);
    full.children = full.children.slice(0, t);

    // 把 midKey 和 right 插入 parent
    parent.keys.splice(i, 0, midKey);
    parent.children.splice(i + 1, 0, right);
    this.hooks.onPromote?.(midKey, i);
  }

  /** 二分下界：返回首个 keys[i] >= value 的 i（即 value 应插入的下标）。 */
  private lowerBound(keys: number[], value: number): number {
    let lo = 0;
    let hi = keys.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (keys[mid]! < value) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /** 搜索值是否存在。 */
  search(value: number): boolean {
    return this.searchIn(this.root, value);
  }
  private searchIn(node: BTreeNode | null, value: number): boolean {
    if (!node) return false;
    const idx = this.lowerBound(node.keys, value);
    if (idx < node.keys.length && node.keys[idx]! === value) return true;
    if (node.leaf) return false;
    return this.searchIn(node.children[idx]!, value);
  }
}

/** 中序遍历：应得到升序序列。 */
export function inorder(node: BTreeNode | null): number[] {
  const out: number[] = [];
  const walk = (n: BTreeNode | null): void => {
    if (!n) return;
    if (n.leaf) {
      out.push(...n.keys);
      return;
    }
    for (let i = 0; i < n.keys.length; i++) {
      walk(n.children[i] ?? null);
      out.push(n.keys[i]!);
    }
    walk(n.children[n.keys.length]!);
  };
  walk(node);
  return out;
}

/**
 * 校验 B 树性质：
 * - 所有节点关键字数 ∈ [t-1, 2t-1]（根除外，根 ≥ 1）
 * - 关键字升序
 * - 等高：所有叶子在同一层
 * @returns 是否合法
 */
export function isValidBTree(tree: BTree): boolean {
  if (tree.root === null) return true;
  const { t } = tree;
  let leafDepth = -1;
  const check = (node: BTreeNode, depth: number): boolean => {
    // 关键字数范围
    if (node !== tree.root) {
      if (node.keys.length < t - 1 || node.keys.length > 2 * t - 1) return false;
    } else if (node.keys.length < 1 || node.keys.length > 2 * t - 1) {
      return false;
    }
    // 非降序（允许重复值作为独立关键字相邻存在）
    for (let i = 1; i < node.keys.length; i++) {
      if (node.keys[i - 1]! > node.keys[i]!) return false;
    }
    // 子节点数 = keys+1（内部节点）
    if (!node.leaf && node.children.length !== node.keys.length + 1) return false;
    if (node.leaf) {
      if (node.children.length !== 0) return false;
      if (leafDepth === -1) leafDepth = depth;
      else if (leafDepth !== depth) return false;
      return true;
    }
    for (const c of node.children) if (!check(c, depth + 1)) return false;
    return true;
  };
  return check(tree.root!, 0);
}

/** 便捷：构造一棵 B 树并插入所有值（t=2 默认 2-3-4 树）。 */
export function bTree(values: readonly number[], t = 2, hooks: BTreeHooks = {}): BTree {
  const tree = new BTree(t, hooks);
  tree.insertAll(values);
  return tree;
}
