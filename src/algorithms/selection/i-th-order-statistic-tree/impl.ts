// 顺序统计树 · 纯算法实现
// 带 size 域的 BST，支持 insert 与 OS-Select（找第 k 小）。

export interface OSTNode {
  value: number;
  size: number; // 子树节点数（含自身）
  left: OSTNode | null;
  right: OSTNode | null;
}

/** 事件钩子。 */
export interface OSTHooks {
  /** 插入一个值（给出当前路径节点值序列）。 */
  onInsert?: (value: number, path: number[]) => void;
  /** OS-Select 访问节点（给出当前节点值、其左子树大小、决定方向）。 */
  onVisit?: (value: number, leftSize: number, decision: 'found' | 'left' | 'right') => void;
  /** 找到第 k 小。 */
  onResult?: (k: number, value: number) => void;
}

/** 插入一个值到顺序统计树（不修改原树，返回新树根）。 */
export function insert(root: OSTNode | null, value: number, hooks: OSTHooks = {}): OSTNode {
  const path: number[] = [];
  const visit = (node: OSTNode | null): OSTNode => {
    if (node === null) {
      return { value, size: 1, left: null, right: null };
    }
    path.push(node.value);
    if (value < node.value) {
      node.left = visit(node.left);
    } else if (value > node.value) {
      node.right = visit(node.right);
    }
    // value 相等忽略（无重复）
    node.size = 1 + (node.left?.size ?? 0) + (node.right?.size ?? 0);
    return node;
  };
  const r = visit(root);
  hooks.onInsert?.(value, path);
  return r;
}

/** 从数组构建顺序统计树。 */
export function buildOST(arr: readonly number[], hooks: OSTHooks = {}): OSTNode | null {
  let root: OSTNode | null = null;
  for (const v of arr) root = insert(root, v, hooks);
  return root;
}

/** 左子树大小。 */
function leftSize(node: OSTNode | null): number {
  return node?.left?.size ?? 0;
}

/**
 * OS-Select：在顺序统计树中找第 k 小（1-based）。
 * @param root 树根
 * @param k 排名（1-based，1 = 最小）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的值
 */
export function osSelect(root: OSTNode | null, k: number, hooks: OSTHooks = {}): number {
  if (k < 1) throw new RangeError(`k 必须 >=1，收到 ${k}`);
  let node = root;
  let rank = k;
  while (node !== null) {
    const r = leftSize(node) + 1;
    if (rank === r) {
      hooks.onVisit?.(node.value, r - 1, 'found');
      hooks.onResult?.(k, node.value);
      return node.value;
    }
    if (rank < r) {
      hooks.onVisit?.(node.value, r - 1, 'left');
      node = node.left;
    } else {
      hooks.onVisit?.(node.value, r - 1, 'right');
      rank -= r;
      node = node.right;
    }
  }
  throw new RangeError(`k 超出树的大小: ${k}`);
}

/** 查询树的总大小。 */
export function treeSize(root: OSTNode | null): number {
  return root?.size ?? 0;
}
