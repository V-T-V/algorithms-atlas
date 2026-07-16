// 树策略 · 实现

export interface TPNode {
  visits: number;
  wins: number;
  untried: number[]; // 未尝试动作
  children: Map<number, TPNode>;
  parent: TPNode | null;
}

export function makeTPNode(parent: TPNode | null = null): TPNode {
  return { visits: 0, wins: 0, untried: [], children: new Map(), parent };
}

export interface TreePolicyHooks {
  onSelect?: (action: number, ucb: number) => void;
  onExpand?: (action: number) => void;
}

/** 计算 UCB1 值。 */
export function ucb1(visits: number, wins: number, parentVisits: number, c = Math.SQRT2): number {
  if (visits === 0) return Infinity;
  return wins / visits + c * Math.sqrt(Math.log(parentVisits) / visits);
}

/**
 * 树策略：从 node 出发选择/扩展，返回到达的节点。
 * @param node 起始节点
 * @param legalActions 返回节点处合法动作的函数
 * @param isTerminal 判断节点是否终局
 * @param apply 动作转移：给定父节点和动作返回新节点（已挂到父）
 */
export function treePolicy(
  node: TPNode,
  legalActions: (n: TPNode) => number[],
  isTerminal: (n: TPNode) => boolean,
  apply: (parent: TPNode, action: number) => TPNode,
  hooks: TreePolicyHooks = {},
  c = Math.SQRT2,
): TPNode {
  let current = node;
  // 初始化 untried
  if (current.untried.length === 0 && current.children.size === 0 && !isTerminal(current)) {
    current.untried = legalActions(current);
  }
  while (!isTerminal(current)) {
    if (current.untried.length > 0) {
      // 扩展：取一个未尝试动作
      const action = current.untried.pop()!;
      const child = apply(current, action);
      current.children.set(action, child);
      hooks.onExpand?.(action);
      return child;
    }
    // 选择：UCB1 最优子节点
    let bestChild: TPNode | null = null;
    let bestAction = -1;
    let bestUcb = -Infinity;
    for (const [action, child] of current.children) {
      if (child.visits === 0) {
        bestChild = child;
        bestAction = action;
        break;
      }
      const u = ucb1(child.visits, child.wins, current.visits, c);
      if (u > bestUcb) {
        bestUcb = u;
        bestChild = child;
        bestAction = action;
      }
    }
    if (bestChild === null) break;
    hooks.onSelect?.(bestAction, bestUcb);
    current = bestChild;
    // 子节点也需初始化 untried
    if (current.untried.length === 0 && current.children.size === 0 && !isTerminal(current)) {
      current.untried = legalActions(current);
    }
  }
  return current;
}
