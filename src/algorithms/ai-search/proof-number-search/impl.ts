// =============================================================================
// 证明数搜索（Proof-Number Search, PN-Search）· 纯算法实现
// 在 AND-OR 树上工作。叶子节点带 type: 'proven' | 'disproven' | 'unknown'。
// OR 节点 = 轮到我，AND 节点 = 轮到对手。
// =============================================================================

export type NodeType = 'OR' | 'AND';
export type LeafState = 'proven' | 'disproven' | 'unknown';

export interface PnNode {
  id: string;
  type: NodeType;
  /** 叶子状态（仅叶子有）。 */
  leafState?: LeafState;
  children?: PnNode[];
  /** 证明数：证明该节点所需的最少额外叶节点数（∞ 表示无法证明）。 */
  proof: number;
  /** 反证数。 */
  disproof: number;
  /** 是否已展开（非叶且 children 已生成）。 */
  expanded: boolean;
}

export const INF: number = 1_000_000; // 用大数代替真 ∞，便于算术

export interface PnHooks {
  /** 每次迭代开始。 */
  onIter?: (iter: number) => void;
  /** 找到最关键叶节点并展开。 */
  onExpand?: (leafId: string, leafState: LeafState) => void;
  /** 根的 pn/dn 更新。 */
  onRootUpdate?: (proof: number, disproof: number) => void;
}

/**
 * 计算一个节点的 proof/disproof（基于子节点）。
 * OR 节点：proof = min(子.proof)，disproof = sum(子.disproof)。
 * AND 节点：proof = sum(子.proof)，disproof = min(子.disproof)。
 * 用 INF 截断避免溢出。
 */
function updateNode(node: PnNode): void {
  if (node.children === undefined || node.children.length === 0) {
    // 叶子：proof/disproof 由 leafState 决定（在创建时设置）
    return;
  }
  if (node.type === 'OR') {
    let p = INF;
    let d = 0;
    for (const c of node.children) {
      p = Math.min(p, c.proof);
      d = Math.min(INF, d + c.disproof);
    }
    node.proof = p;
    node.disproof = d;
  } else {
    let p = 0;
    let d = INF;
    for (const c of node.children) {
      p = Math.min(INF, p + c.proof);
      d = Math.min(d, c.disproof);
    }
    node.proof = p;
    node.disproof = d;
  }
}

/** 设置叶子的 proof/disproof。 */
export function setLeafByState(node: PnNode): void {
  switch (node.leafState) {
    case 'proven':
      node.proof = 0;
      node.disproof = INF;
      break;
    case 'disproven':
      node.proof = INF;
      node.disproof = 0;
      break;
    default: // unknown
      node.proof = 1;
      node.disproof = 1;
  }
}

/** 找到当前最关键叶节点（沿 pn/dn 最优下行）。返回路径。 */
function findMostProving(root: PnNode): PnNode[] {
  const path: PnNode[] = [root];
  let node = root;
  while (node.children !== undefined && node.children.length > 0) {
    if (node.type === 'OR') {
      // 选 proof 最小的子
      let best = node.children[0]!;
      for (const c of node.children) {
        if (c.proof < best.proof) best = c;
      }
      node = best;
    } else {
      // AND 节点选 disproof 最小的子
      let best = node.children[0]!;
      for (const c of node.children) {
        if (c.disproof < best.disproof) best = c;
      }
      node = best;
    }
    path.push(node);
  }
  return path;
}

/**
 * 展开一个叶子：用 expander 生成其子节点，然后沿路径回传更新。
 */
function expandLeaf(path: PnNode[], expander: (leaf: PnNode) => PnNode[]): void {
  const leaf = path[path.length - 1]!;
  const children = expander(leaf);
  leaf.children = children;
  leaf.expanded = true;
  // 子节点先各自按 leafState 计算 proof/disproof
  for (const c of children) {
    if (c.children === undefined) setLeafByState(c);
    else updateNode(c);
  }
  // 沿路径回传
  for (let i = path.length - 1; i >= 0; i--) {
    updateNode(path[i]!);
  }
}

export interface PnResult {
  /** 是否已证明（root.proof === 0）。 */
  proven: boolean;
  /** 是否已反证（root.disproof === 0）。 */
  disproven: boolean;
  /** 已展开迭代数。 */
  iterations: number;
  /** 是否因达到迭代上限而未决。 */
  unresolved: boolean;
}

/**
 * PN-Search 主函数。
 *
 * @param root 根节点（其子树可能为空 → 视为待展开叶子）
 * @param expander 把一个未展开叶子映射为其子节点列表
 * @param maxIterations 迭代上限
 * @param hooks 钩子
 */
export function proofNumberSearch(
  root: PnNode,
  expander: (leaf: PnNode) => PnNode[],
  maxIterations: number = 1000,
  hooks: PnHooks = {},
): PnResult {
  // 初始化根
  if (root.children === undefined) {
    setLeafByState(root);
  } else {
    // 递归初始化整棵已知树
    initTree(root);
  }

  let iter = 0;
  while (iter < maxIterations) {
    hooks.onIter?.(iter);
    // 根已决？
    if (root.proof === 0) {
      return { proven: true, disproven: false, iterations: iter, unresolved: false };
    }
    if (root.disproof === 0) {
      return { proven: false, disproven: true, iterations: iter, unresolved: false };
    }

    const path = findMostProving(root);
    const leaf = path[path.length - 1]!;
    hooks.onExpand?.(leaf.id, leaf.leafState ?? 'unknown');
    expandLeaf(path, expander);
    hooks.onRootUpdate?.(root.proof, root.disproof);
    iter++;
  }

  return {
    proven: root.proof === 0,
    disproven: root.disproof === 0,
    iterations: iter,
    unresolved: root.proof !== 0 && root.disproof !== 0,
  };
}

/** 递归初始化已知树（为每个节点算 proof/disproof）。 */
function initTree(node: PnNode): void {
  if (node.children === undefined || node.children.length === 0) {
    setLeafByState(node);
    return;
  }
  for (const c of node.children) initTree(c);
  updateNode(node);
}
