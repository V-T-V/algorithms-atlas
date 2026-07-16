// =============================================================================
// 期望极小极大（Expectiminimax）· 纯算法实现
// 在 minimax 基础上引入「机会节点（CHANCE）」：当存在随机事件时，
// 机会节点的值 = 各子节点效用按概率加权的期望。MAX/MIN 节点行为同 minimax。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步求值供录制器使用。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

/** 节点类型：最大化 / 最小化 / 机会。 */
export type NodeType = 'MAX' | 'MIN' | 'CHANCE';

/** 期望极小极大树节点。叶子带 value；机会节点的子节点带概率。 */
export interface ExpectiNode {
  id: string;
  type: NodeType;
  /** 叶子的效用值；内部节点求值后回填。 */
  value?: number;
  /** 子节点。 */
  children: ExpectiNode[];
  /** 仅 CHANCE 节点用：children[i] 对应的概率（须与 children 等长、和为 1）。 */
  probabilities?: number[];
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ExpectiminimaxHooks {
  /** 计算完某节点的效用值（含叶子直接返回）。给出节点 id、类型、最终值。 */
  onEvaluate?: (nodeId: string, type: NodeType, value: number) => void;
  /** MAX 层考虑子节点 childId，当前已知最大值。 */
  onMax?: (parentId: string, childId: string, currentMax: number) => void;
  /** MIN 层考虑子节点 childId，当前已知最小值。 */
  onMin?: (parentId: string, childId: string, currentMin: number) => void;
  /** CHANCE 层累加一个子节点的期望贡献：prob * childValue，给出当前累计期望。 */
  onChance?: (parentId: string, childId: string, prob: number, runningExpected: number) => void;
}

/** 求值结果。 */
export interface ExpectiminimaxResult {
  /** 根节点效用（期望效用）。 */
  value: number;
  /** 根的最优子节点 id（仅 MAX/MIN 有意义；CHANCE 根返回 null）。 */
  bestChildId: string | null;
}

/**
 * 期望极小极大算法。
 *
 * - **MAX** 节点：返回子节点效用最大值，记录最优子。
 * - **MIN** 节点：返回子节点效用最小值，记录最优子。
 * - **CHANCE** 节点：返回 `Σ prob[i] · value(children[i])`（概率加权期望）。
 * - 叶子节点直接返回 `value`（缺省 0）。
 *
 * 约定根节点类型任意；从根起，子节点类型通常与父节点不同（MAX→MIN→CHANCE→MAX… 的循环
 * 是常见模式，但本实现不强制交替，由调用方构造合法树）。
 *
 * @param root 树根
 * @param hooks 可选事件钩子
 */
export function expectiminimax(
  root: ExpectiNode,
  hooks: ExpectiminimaxHooks = {},
): ExpectiminimaxResult {
  let bestChildId: string | null = null;

  const recurse = (node: ExpectiNode): number => {
    // 叶子
    if (node.children.length === 0) {
      const v = node.value ?? 0;
      hooks.onEvaluate?.(node.id, node.type, v);
      node.value = v;
      return v;
    }

    let value: number;
    let bestChild: string | null = null;

    if (node.type === 'MAX') {
      value = -Infinity;
      for (const child of node.children) {
        const cv = recurse(child);
        if (cv > value) {
          value = cv;
          bestChild = child.id;
        }
        hooks.onMax?.(node.id, child.id, value);
      }
    } else if (node.type === 'MIN') {
      value = Infinity;
      for (const child of node.children) {
        const cv = recurse(child);
        if (cv < value) {
          value = cv;
          bestChild = child.id;
        }
        hooks.onMin?.(node.id, child.id, value);
      }
    } else {
      // CHANCE
      value = 0;
      const probs = node.probabilities;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]!;
        const cv = recurse(child);
        const p = probs ? (probs[i] ?? 0) : 1 / node.children.length;
        value += p * cv;
        hooks.onChance?.(node.id, child.id, p, value);
      }
    }

    node.value = value;
    hooks.onEvaluate?.(node.id, node.type, value);
    if (node === root) bestChildId = bestChild;
    return value;
  };

  const value = recurse(root);
  return { value, bestChildId };
}

/** 把 ExpectiNode 转成 viz 用的 TreeNode（含 value 文本与类型标注）。 */
export function toTreeNode(node: ExpectiNode): TreeNode {
  const label =
    node.value !== undefined
      ? node.type === 'CHANCE'
        ? `${node.value.toFixed(2)}`
        : String(node.value)
      : node.type;
  return {
    id: node.id,
    value: label,
    children: node.children.map(toTreeNode),
  };
}
