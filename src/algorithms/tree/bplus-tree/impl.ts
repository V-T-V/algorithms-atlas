// =============================================================================
// B+ 树（B+ Tree）· 纯算法实现
// 阶 m：内部节点最多 m 个子、最少 ⌈m/2⌉；叶子存数据并串成链表。
// 零 DOM 依赖，可独立单测。仅实现插入 + 查找 + 范围查询（够演示用）。
// =============================================================================

export interface BPlusLeaf {
  isLeaf: true;
  keys: number[];
  next: BPlusLeaf | null; // 右兄弟叶子（叶子链表）
}
export interface BPlusInternal {
  isLeaf: false;
  keys: number[]; // 索引键：keys[i] = children[i+1] 子树最小键
  children: BPlusNode[];
}
export type BPlusNode = BPlusLeaf | BPlusInternal;

export interface BPlusHooks {
  /** 查找时沿某内部节点的索引键比较。 */
  onDescend?: (keys: number[], chosenChildIndex: number) => void;
  /** 到达叶子。 */
  onLeaf?: (leafKeys: number[]) => void;
  /** 叶子节点分裂。 */
  onSplitLeaf?: (leftKeys: number[], rightKeys: number[]) => void;
  /** 内部节点分裂。 */
  onSplitInternal?: (promotedKey: number) => void;
  /** 插入了一个键。 */
  onInsert?: (key: number) => void;
}

const ORDER = 4; // 阶 m：内部节点最多 m 个子、最多 m-1 个键

/** 创建空 B+ 树根（空叶子）。 */
export function newBPlusTree(): BPlusNode {
  return { isLeaf: true, keys: [], next: null };
}

/** 在内部节点 keys 中找到第一个 > key 的位置 → 子树索引。 */
function findChildIndex(keys: number[], key: number): number {
  let lo = 0;
  let hi = keys.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (keys[mid]! <= key) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** 插入 key。返回（可能新的）根。 */
export function bplusInsert(root: BPlusNode, key: number, hooks: BPlusHooks = {}): BPlusNode {
  // 递归插入，返回 [newNode, promotedKey?]；若分裂则 newNode 不为 null
  const insertRec = (
    node: BPlusNode,
  ): { node: BPlusNode; split: BPlusNode | null; promoted: number | null } => {
    if (node.isLeaf) {
      // 叶子：有序插入
      const idx = node.keys.findIndex((k) => k >= key);
      if (idx !== -1 && node.keys[idx] === key) {
        // 已存在（去重）
        return { node, split: null, promoted: null };
      }
      const insertAt = idx === -1 ? node.keys.length : idx;
      node.keys.splice(insertAt, 0, key);
      hooks.onInsert?.(key);
      // 叶子上限 = ORDER - 1 个键
      if (node.keys.length <= ORDER - 1) {
        return { node, split: null, promoted: null };
      }
      // 分裂叶子
      const mid = Math.ceil(node.keys.length / 2);
      const rightKeys = node.keys.splice(mid);
      const rightLeaf: BPlusLeaf = { isLeaf: true, keys: rightKeys, next: node.next };
      node.next = rightLeaf;
      hooks.onSplitLeaf?.(node.keys, rightKeys);
      return { node, split: rightLeaf, promoted: rightKeys[0]! };
    }
    // 内部节点：选子树递归
    const ci = findChildIndex(node.keys, key);
    hooks.onDescend?.(node.keys, ci);
    const child = node.children[ci]!;
    const result = insertRec(child);
    if (result.split === null) {
      return { node, split: null, promoted: null };
    }
    // 子节点分裂，需插入 promoted key 与新子节点
    node.keys.splice(ci, 0, result.promoted!);
    node.children.splice(ci + 1, 0, result.split);
    // 内部节点上限 = ORDER - 1 个键 → ORDER 个子
    if (node.keys.length <= ORDER - 1) {
      return { node, split: null, promoted: null };
    }
    // 内部节点分裂：中间键上提（不像叶子那样保留）
    const mid = Math.floor(node.keys.length / 2);
    const upKey = node.keys[mid]!;
    const rightKeys = node.keys.splice(mid + 1);
    node.keys.pop(); // 移除已上提的 mid 键
    const rightChildren = node.children.splice(mid + 1);
    const rightInternal: BPlusInternal = {
      isLeaf: false,
      keys: rightKeys,
      children: rightChildren,
    };
    hooks.onSplitInternal?.(upKey);
    return { node, split: rightInternal, promoted: upKey };
  };

  const result = insertRec(root);
  if (result.split !== null) {
    // 根分裂：新建根
    const newRoot: BPlusInternal = {
      isLeaf: false,
      keys: [result.promoted!],
      children: [root, result.split],
    };
    return newRoot;
  }
  return root;
}

/** 精确查找 key 是否存在。 */
export function bplusSearch(root: BPlusNode, key: number, hooks: BPlusHooks = {}): boolean {
  let node = root;
  while (!node.isLeaf) {
    const ci = findChildIndex(node.keys, key);
    hooks.onDescend?.(node.keys, ci);
    node = node.children[ci]!;
  }
  hooks.onLeaf?.(node.keys);
  return node.keys.includes(key);
}

/** 范围查询 [lo, hi]，利用叶子链表。 */
export function bplusRange(root: BPlusNode, lo: number, hi: number): number[] {
  // 找到包含 lo 的叶子
  let node = root;
  while (!node.isLeaf) {
    node = node.children[findChildIndex(node.keys, lo)]!;
  }
  const out: number[] = [];
  let leaf: BPlusLeaf | null = node;
  while (leaf !== null) {
    for (const k of leaf.keys) {
      if (k >= lo && k <= hi) out.push(k);
      if (k > hi) return out;
    }
    leaf = leaf.next;
  }
  return out;
}

/** 收集所有叶子键（顺序遍历叶子链表）。 */
export function leafKeys(root: BPlusNode): number[] {
  let node = root;
  while (!node.isLeaf) node = node.children[0]!;
  const out: number[] = [];
  let leaf: BPlusLeaf | null = node;
  while (leaf !== null) {
    out.push(...leaf.keys);
    leaf = leaf.next;
  }
  return out;
}

/** 计算树高（叶子层为 1）。 */
export function bplusHeight(root: BPlusNode): number {
  let h = 1;
  let node = root;
  while (!node.isLeaf) {
    h++;
    node = node.children[0]!;
  }
  return h;
}

/** 批量插入构造 B+ 树。 */
export function buildBPlus(keys: readonly number[], hooks: BPlusHooks = {}): BPlusNode {
  let root: BPlusNode = newBPlusTree();
  for (const k of keys) {
    root = bplusInsert(root, k, hooks);
  }
  return root;
}
