// =============================================================================
// 博弈最佳优先搜索（B*, Berliner 1979）· 纯算法实现
// 每节点维护 opt/pess 双估值，按 best-first 扩展直到根的决策被证明。
// =============================================================================

export interface BstarNode {
  id: string;
  /** 站 MAX（根玩家）视角。叶子可给定 utility。 */
  utility?: number;
  children?: BstarNode[];
  /** 乐观值（上界）。 */
  opt: number;
  /** 悲观值（下界）。 */
  pess: number;
  /** 是否 MAX 节点（根为 true，逐层交替）。 */
  isMax: boolean;
  /** 是否已展开。 */
  expanded: boolean;
}

export interface BstarHooks {
  onExpand?: (node: BstarNode) => void;
  onPropagate?: (node: BstarNode) => void;
  onProven?: (bestChild: BstarNode) => void;
}

export interface BstarConfig {
  /** 叶子的乐观容差：opt = utility + tol，pess = utility - tol。 */
  tolerance: number;
  /** 最大展开次数（避免无限循环）。 */
  maxExpansions: number;
}

export const DEFAULT_BSTAR_CONFIG: BstarConfig = {
  tolerance: 5,
  maxExpansions: 100,
};

/**
 * 用「完整博弈树」一次性构造（所有内部节点给定 children，叶子给定 utility）。
 * 我们用「逐步展开」的 B* 风格：但实际上把树作为输入，B* 决定展开顺序。
 *
 * 为保持简洁与可演示，本实现接受一棵完整树，按 B* 的 best-first 顺序展开：
 *   1. 从根开始递归选「最有希望」的叶子展开。
 *   2. 展开一个叶子 = 把其 children 标记为 expanded 并设置初始 opt/pess。
 *   3. 向上传播 opt/pess。
 *   4. 重复直到根的某个子节点 pess >= 其他子节点 opt（证明成立）。
 *
 * @param root 根节点（已有完整 children 结构）
 * @param config 配置
 * @param hooks 钩子
 */
export function bstar(
  root: BstarNode,
  config: BstarConfig = DEFAULT_BSTAR_CONFIG,
  hooks: BstarHooks = {},
): BstarNode {
  // 初始化：把叶子的 opt/pess 设为 utility ± tol；内部节点先标记为「未展开」
  const init = (node: BstarNode): void => {
    if (node.children === undefined || node.children.length === 0) {
      const u = node.utility ?? 0;
      node.opt = u + config.tolerance;
      node.pess = u - config.tolerance;
      node.expanded = true;
    } else {
      // 未展开：用极宽的边界（待展开后收紧）
      node.opt = node.isMax ? Infinity : Infinity;
      node.pess = node.isMax ? -Infinity : -Infinity;
      node.expanded = false;
    }
    node.children?.forEach(init);
  };
  init(root);

  // 实际上为了 B* 的「逐步」语义，我们一开始就把所有内部节点当作「未展开」，
  // 每步展开一层最佳叶子；但叶子已直接定值。这里采用「逐层展开」简化模型：
  // 把内部节点视为「可展开」——展开 = 计算其 opt/pess（用子节点聚合）。
  //
  // 简化策略（教学用）：按 BFS 逐层展开，每层完成后传播；直到根的证明成立。
  const aggregate = (node: BstarNode): void => {
    if (node.children === undefined || node.children.length === 0) return;
    if (node.isMax) {
      node.opt = Math.max(...node.children.map((c) => c.opt));
      node.pess = Math.max(...node.children.map((c) => c.pess));
    } else {
      node.opt = Math.min(...node.children.map((c) => c.opt));
      node.pess = Math.min(...node.children.map((c) => c.pess));
    }
  };

  // best-first 展开：选一个未展开的、在「最佳路径」上的内部节点
  const selectBestLeaf = (node: BstarNode, depth: number): BstarNode | null => {
    if (node.children === undefined || node.children.length === 0) return null;
    if (!node.expanded) {
      // 展开：聚合（子节点必须已展开）
      const allChildrenExpanded = node.children.every((c) => c.expanded);
      if (allChildrenExpanded) {
        aggregate(node);
        node.expanded = true;
        hooks.onExpand?.(node);
        return node;
      }
    }
    // 选「最佳」子节点深入
    let best: BstarNode | null = null;
    let bestScore = -Infinity;
    for (const c of node.children) {
      // MAX 选最大 opt；MIN 选最小 opt（站在 MAX 视角看 MIN 会选最小）
      const score = node.isMax ? c.opt : -c.opt;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    if (best === null) return null;
    return selectBestLeaf(best, depth + 1);
  };

  // 自底向上传播
  const propagate = (node: BstarNode): void => {
    if (node.children === undefined || node.children.length === 0) return;
    for (const c of node.children) propagate(c);
    if (node.expanded) {
      const beforeOpt = node.opt;
      const beforePess = node.pess;
      aggregate(node);
      if (node.opt !== beforeOpt || node.pess !== beforePess) {
        hooks.onPropagate?.(node);
      }
    }
  };

  // 根是否已被证明：某个子节点的 pess >= 其他所有子节点的 opt
  const provenChild = (): BstarNode | null => {
    if (root.children === undefined) return null;
    for (const c of root.children) {
      const othersMaxOpt = Math.max(
        ...root.children.filter((x) => x !== c).map((x) => x.opt),
        -Infinity,
      );
      if (c.pess >= othersMaxOpt) return c;
    }
    return null;
  };

  // 主循环：反复展开最佳叶子、传播，直到证明成立或耗尽预算
  // 注意：因为初始化时所有叶子已定值，但内部节点未展开，我们要逐层展开。
  // 为了能展开根，需要先把根的子节点展开……所以从最深层向上展开。
  let expansionCount = 0;
  while (expansionCount < config.maxExpansions) {
    const leaf = selectBestLeaf(root, 0);
    if (leaf === null) break;
    expansionCount += 1;
    propagate(root);
    const proven = provenChild();
    if (proven) {
      hooks.onProven?.(proven);
      return proven;
    }
  }

  // 没有严格证明：返回当前 pess 最大的子节点
  let best = root.children?.[0] ?? root;
  for (const c of root.children ?? []) {
    if (c.pess > best.pess) best = c;
  }
  return best;
}

// —— 构建示例博弈树（带 utility 的叶子）——

export interface FlatSpec {
  utilities: number[];
  branching: number;
}

export function buildTree(spec: FlatSpec): BstarNode {
  const { utilities, branching } = spec;
  let idx = 0;
  let counter = 0;
  const make = (depth: number, isMax: boolean): BstarNode => {
    const id = `b${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u, opt: 0, pess: 0, isMax, expanded: false };
    }
    const children: BstarNode[] = [];
    for (let k = 0; k < branching; k++) children.push(make(depth - 1, !isMax));
    return { id, opt: 0, pess: 0, isMax, expanded: false, children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth, true);
}
