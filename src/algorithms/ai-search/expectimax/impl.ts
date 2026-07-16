// =============================================================================
// 期望最大搜索（Expectimax）· 纯算法实现
// 树节点有三种角色：MAX（取最大）、CHANCE（取加权期望）、LEAF（带 utility）。
// =============================================================================

export type NodeKind = 'max' | 'chance' | 'leaf';

export interface ExpectNode {
  id: string;
  kind: NodeKind;
  /** 叶子效用（仅 leaf 用）。 */
  utility?: number;
  /** CHANCE 节点的各子节点概率（须和为 1，顺序对应 children）。 */
  probabilities?: number[];
  children?: ExpectNode[];
  /** 搜索完成后填充的值。 */
  value?: number;
}

export interface ExpectimaxHooks {
  onEvaluate?: (node: ExpectNode, score: number, depth: number) => void;
  onReturn?: (node: ExpectNode, value: number, depth: number) => void;
}

/**
 * Expectimax 主函数。
 *
 * @param node 当前节点
 * @param depth 剩余深度
 * @param hooks 钩子
 */
export function expectimax(node: ExpectNode, depth: number, hooks: ExpectimaxHooks = {}): number {
  // 叶子或深度耗尽
  if (
    node.kind === 'leaf' ||
    depth === 0 ||
    node.children === undefined ||
    node.children.length === 0
  ) {
    const score = node.utility ?? 0;
    node.value = score;
    hooks.onEvaluate?.(node, score, depth);
    return score;
  }

  if (node.kind === 'max') {
    let best = -Infinity;
    for (const child of node.children) {
      const v = expectimax(child, depth - 1, hooks);
      if (v > best) best = v;
    }
    node.value = best;
    hooks.onReturn?.(node, best, depth);
    return best;
  }

  // kind === 'chance'：加权期望
  const probs = node.probabilities;
  let sum = 0;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]!;
    const v = expectimax(child, depth - 1, hooks);
    const p = probs !== undefined && probs[i] !== undefined ? probs[i]! : 1 / node.children.length;
    sum += p * v;
  }
  node.value = sum;
  hooks.onReturn?.(node, sum, depth);
  return sum;
}

// —— 构建示例：1-2-3 骰子游戏 —— --------------------------------------------
// 玩家选「停」（拿当前 utility）或「掷」一颗 1/2/3 各 1/3 的骰子，
// 骰点决定走向哪个叶子。MAX 在决策层，CHANCE 在掷骰层。

export function buildDiceTree(): ExpectNode {
  let counter = 0;
  const id = (): string => `e${counter++}`;

  const makeLeaf = (u: number): ExpectNode => ({ id: id(), kind: 'leaf', utility: u });

  // 决策点：停(=5) 或 掷(chance)
  const decision: ExpectNode = {
    id: id(),
    kind: 'max',
    children: [
      makeLeaf(5), // 停，拿 5
      {
        id: id(),
        kind: 'chance',
        probabilities: [1 / 3, 1 / 3, 1 / 3],
        children: [makeLeaf(3), makeLeaf(6), makeLeaf(0)],
      },
    ],
  };
  return decision;
}
