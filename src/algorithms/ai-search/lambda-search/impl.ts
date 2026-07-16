// =============================================================================
// Lambda 搜索（基于威胁数的搜索）· 纯算法实现
// 在简化的「威胁博弈树」上工作：节点带 utility，威胁阈值 = winThreshold。
// λ 搜索：λ=1 直接获胜；λ=k 用强制走法递归。
// =============================================================================

export interface LambdaNode {
  id: string;
  /** 站当前玩家视角的效用（叶子=静态评估；utility >= winThreshold 表示「获胜」）。 */
  utility?: number;
  children?: LambdaNode[];
  /** 搜索后填充的值。 */
  value?: number;
  /** 是否被判定为某 λ 层的威胁节点。 */
  threatLevel?: number;
}

export interface LambdaConfig {
  /** 获胜阈值：utility ≥ winThreshold 即当前玩家胜。 */
  winThreshold: number;
  /** 最大 λ（避免无限递归）。 */
  maxLambda: number;
}

export const DEFAULT_LAMBDA_CONFIG: LambdaConfig = {
  winThreshold: 100,
  maxLambda: 4,
};

export interface LambdaHooks {
  /** 在某 λ 层检验某节点。 */
  onProbe?: (nodeId: string, lambda: number) => void;
  /** 找到一个 λ 层威胁。 */
  onThreatFound?: (nodeId: string, lambda: number, childId: string) => void;
  /** 某节点被证明（有 λ 层获胜线）。 */
  onProven?: (nodeId: string, lambda: number) => void;
  /** 某节点被证伪（在 λ 内无法获胜）。 */
  onDisproven?: (nodeId: string, lambda: number) => void;
}

/**
 * Lambda 搜索主函数：返回当前节点能获胜的最小 λ（威胁数），不能则返回 ∞。
 *
 * λ=1：是否存在某子节点 utility ≥ winThreshold？
 * λ=k>1：是否存在某子节点（强制走法），使得对手在该子节点下「无法用 λ<k 反威胁」，
 *         且对手回应后我方仍能在 λ=k-1 内获胜？
 */
export function lambdaSearch(
  node: LambdaNode,
  config: LambdaConfig = DEFAULT_LAMBDA_CONFIG,
  hooks: LambdaHooks = {},
): number {
  for (let lambda = 1; lambda <= config.maxLambda; lambda++) {
    hooks.onProbe?.(node.id, lambda);
    if (provesAtLambda(node, lambda, config, hooks)) {
      node.threatLevel = lambda;
      hooks.onProven?.(node.id, lambda);
      return lambda;
    }
  }
  hooks.onDisproven?.(node.id, config.maxLambda);
  return Infinity;
}

/** 检验「当前玩家能否在恰好 λ 步内强制获胜」。 */
function provesAtLambda(
  node: LambdaNode,
  lambda: number,
  config: LambdaConfig,
  hooks: LambdaHooks,
): boolean {
  if (node.children === undefined || node.children.length === 0) {
    return (node.utility ?? 0) >= config.winThreshold;
  }

  if (lambda === 1) {
    // λ=1：直接看是否存在某子节点 utility ≥ 阈值（即一步获胜）
    for (const c of node.children) {
      if ((c.utility ?? 0) >= config.winThreshold) {
        hooks.onThreatFound?.(node.id, 1, c.id);
        return true;
      }
    }
    return false;
  }

  // λ ≥ 2：找一个「强制走法」c，使得对手在 c 下「无法用 λ < lambda 的威胁反击」，
  //        且对手任意回应后，我方在 c 下仍能在 lambda-1 内获胜。
  // 简化模型：把子节点 c 视为「我方走这一步」后的局面；对手从 c 的子节点选最优。
  // 我方走 c 后，对手要在 c 的所有可能回应中找一个 λ < lambda 的反威胁；若找不到，
  // 且至少有一条回应后我方仍有 lambda-1 威胁，则 c 是一个 λ 威胁。
  for (const c of node.children) {
    if (c.children === undefined || c.children.length === 0) {
      // c 是叶：直接看 utility
      if ((c.utility ?? 0) >= config.winThreshold) {
        hooks.onThreatFound?.(node.id, lambda, c.id);
        return true;
      }
      continue;
    }
    // 检验对手在 c 下能否用更小 λ 反击
    let opponentCanCounter = false;
    for (const opp of c.children) {
      // 对手在 opp 节点下能否用 λ < lambda 获胜？
      const oppLambda = smallestOpponentWin(opp, lambda - 1, config, hooks);
      if (oppLambda <= lambda - 1) {
        opponentCanCounter = true;
        break;
      }
    }
    if (opponentCanCounter) continue;
    // 对手无法反击：检查我方在 c 下是否仍能在 lambda-1 内获胜
    // 简化：c 的 utility 是我方走 c 后的评估；若 c.utility ≥ 阈值，即视为获胜
    if ((c.utility ?? 0) >= config.winThreshold) {
      hooks.onThreatFound?.(node.id, lambda, c.id);
      return true;
    }
    // 否则递归：c 子树中是否存在 lambda-1 威胁（我方下一回合）
    // 简化：检查 c 下我方能否在 lambda-1 内获胜——但 c 已经是我方走了，下一节点是对手。
    // 这里用「c 子树的最小 λ」递归。
    const cLambda = smallestOpponentWin(c, lambda - 1, config, hooks);
    if (cLambda <= lambda - 1) {
      hooks.onThreatFound?.(node.id, lambda, c.id);
      return true;
    }
  }
  return false;
}

/** 找对手（在 opp 节点视角）能在多少 λ 内获胜的最小值（上限 = upperBound）。 */
function smallestOpponentWin(
  node: LambdaNode,
  upperBound: number,
  config: LambdaConfig,
  hooks: LambdaHooks,
): number {
  for (let l = 1; l <= upperBound; l++) {
    if (provesAtLambda(node, l, config, hooks)) return l;
  }
  return Infinity;
}

/** 参考：直接 minimax（站当前玩家视角，取最大 utility）。 */
export function bestUtility(node: LambdaNode): number {
  if (node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }
  return Math.max(...node.children.map(bestUtility));
}

// —— 构建示例威胁博弈树 ——

export interface FlatSpec {
  /** 完整的树结构（直接给定）。 */
  root: LambdaNode;
}

/** 简单构造：root 有多个 children，每个 child 有 utility（站 root 玩家视角）。 */
export function buildFlatTree(childUtilities: number[]): LambdaNode {
  return {
    id: 'r',
    children: childUtilities.map((u, i) => ({ id: `c${i}`, utility: u })),
  };
}

/** 深层构造：root -> MAX -> MIN -> 叶子。 */
export function buildDeepTree(branching: number, utilities: number[]): LambdaNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number): LambdaNode => {
    const id = `n${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, utility: u };
    }
    const children: LambdaNode[] = [];
    for (let b = 0; b < branching; b++) children.push(make(depth - 1));
    return { id, children };
  };
  return make(3);
}
