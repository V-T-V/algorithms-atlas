// =============================================================================
// Alpha-Beta 剪枝（Alpha-Beta Pruning）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 在极小极大（minimax）基础上引入 [α, β] 窗口剪枝，结果与 minimax 相同但搜索节点更少。
// =============================================================================

/** 博弈树节点（用于纯树形 alpha-beta）。叶子节点带 value。 */
export interface GameNode {
  /** 节点 id（唯一，便于追溯）。 */
  id: string;
  /** 叶子的效用值；内部节点由子节点聚合得到，初值留空。 */
  value?: number;
  /** 子节点。叶子节点为空数组。 */
  children: GameNode[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AlphaBetaHooks {
  /** 进入某节点求值。给出节点 id、当前 [α, β] 窗口、该层是否为 MAX。 */
  onEnter?: (nodeId: string, alpha: number, beta: number, isMaxLayer: boolean) => void;
  /** 计算完某节点的效用值（含叶子直接返回）。给出节点 id、最终值、该层是否为 MAX。 */
  onEvaluate?: (nodeId: string, value: number, isMaxLayer: boolean) => void;
  /** MAX 层更新 α 后的当前值（候选最大值）。给出父节点 id、子节点 id、当前 α。 */
  onUpdateAlpha?: (parentId: string, childId: string, alpha: number) => void;
  /** MIN 层更新 β 后的当前值（候选最小值）。给出父节点 id、子节点 id、当前 β。 */
  onUpdateBeta?: (parentId: string, childId: string, beta: number) => void;
  /** beta 剪枝（MAX 层触发）：剩余兄弟被剪掉。 */
  onPrune?: (
    parentId: string,
    prunedChildId: string,
    reason: 'beta-cutoff' | 'alpha-cutoff',
  ) => void;
}

/** alpha-beta 求值结果。 */
export interface AlphaBetaResult {
  /** 根节点效用值（与无剪枝 minimax 完全相同）。 */
  value: number;
  /** 最优选择（根节点应走的子节点 id）。 */
  bestChildId: string | null;
  /** 被剪枝的次数。 */
  prunes: number;
}

/**
 * Alpha-Beta 剪枝算法求博弈树根节点的效用值。
 *
 * 在极小极大基础上维护窗口 `[α, β]`：
 * - 根节点为 **MAX** 层（最大化玩家），其子节点为 MIN 层，依此交替。
 * - MAX 层取子节点最大值，并更新 `α = max(α, value)`；一旦 `α >= β`，剩余兄弟
 *   不可能再降低 MIN 层的选择（β-cutoff），可整段剪掉。
 * - MIN 层取子节点最小值，并更新 `β = min(β, value)`；一旦 `β <= α`，剩余兄弟
 *   不可能再提升 MAX 层的选择（α-cutoff），可整段剪掉。
 * - 叶子节点直接返回其 `value`。
 *
 * 关键性质：剪枝**不改变**最终结果，与纯 minimax 完全一致，只是少搜索若干子树。
 * 最优节点排列下复杂度从 `O(b^d)` 降到 `O(b^(d/2))`（能多搜索一倍深度）。
 *
 * @param root 博弈树根节点
 * @param hooks 可选的事件钩子
 */
export function alphaBeta(root: GameNode, hooks: AlphaBetaHooks = {}): AlphaBetaResult {
  let prunes = 0;
  let bestChildId: string | null = null;

  const recurse = (node: GameNode, alpha: number, beta: number, isMax: boolean): number => {
    hooks.onEnter?.(node.id, alpha, beta, isMax);

    // 叶子：直接返回效用
    if (node.children.length === 0) {
      const v = node.value ?? 0;
      hooks.onEvaluate?.(node.id, v, isMax);
      return v;
    }

    let value: number;
    let bestChild: string | null = null;
    if (isMax) {
      value = -Infinity;
      for (const child of node.children) {
        const cv = recurse(child, alpha, beta, false);
        if (cv > value) {
          value = cv;
          bestChild = child.id;
        }
        alpha = Math.max(alpha, value);
        hooks.onUpdateAlpha?.(node.id, child.id, alpha);
        if (alpha >= beta) {
          // β 剪枝：剩余兄弟剪掉
          const idx = node.children.indexOf(child);
          for (let k = idx + 1; k < node.children.length; k++) {
            prunes++;
            hooks.onPrune?.(node.id, node.children[k]!.id, 'beta-cutoff');
          }
          break;
        }
      }
    } else {
      value = Infinity;
      for (const child of node.children) {
        const cv = recurse(child, alpha, beta, true);
        if (cv < value) {
          value = cv;
          bestChild = child.id;
        }
        beta = Math.min(beta, value);
        hooks.onUpdateBeta?.(node.id, child.id, beta);
        if (beta <= alpha) {
          const idx = node.children.indexOf(child);
          for (let k = idx + 1; k < node.children.length; k++) {
            prunes++;
            hooks.onPrune?.(node.id, node.children[k]!.id, 'alpha-cutoff');
          }
          break;
        }
      }
    }
    hooks.onEvaluate?.(node.id, value, isMax);
    node.value = value; // 把聚合值挂回（便于可视化）
    if (node === root) bestChildId = bestChild;
    return value;
  };

  const value = recurse(root, -Infinity, Infinity, true);
  return { value, bestChildId, prunes };
}

/** 工具：统计一棵树若用「无剪枝 minimax」会求值的叶子数（用于对比演示）。 */
export function countLeaves(node: GameNode): number {
  if (node.children.length === 0) return 1;
  let n = 0;
  for (const c of node.children) n += countLeaves(c);
  return n;
}
