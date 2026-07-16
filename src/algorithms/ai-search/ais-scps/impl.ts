// 序贯条件概率搜索 · 实现

export interface ScpsNode {
  id: string;
  type: 'max' | 'min' | 'chance' | 'leaf';
  utility?: number; // 叶子
  probs?: number[]; // chance 子概率
  dist?: Array<{ value: number; prob: number }>; // 叶子的结果分布
  children?: ScpsNode[];
}

export interface ScpsHooks {
  onEval?: (nodeId: string, type: string, value: number) => void;
}

/**
 * 自底向上计算期望效用。
 * - leaf: 若有 dist 取期望，否则 utility
 * - chance: 概率加权子值
 * - max: 取子最大
 * - min: 取子最小
 */
export function scpsEvaluate(node: ScpsNode, hooks: ScpsHooks = {}): number {
  let value: number;
  if (node.type === 'leaf') {
    if (node.dist && node.dist.length > 0) {
      value = node.dist.reduce((s, d) => s + d.value * d.prob, 0);
    } else {
      value = node.utility ?? 0;
    }
  } else if (node.type === 'chance') {
    value = 0;
    for (let i = 0; i < (node.children?.length ?? 0); i++) {
      const p = node.probs![i] ?? 0;
      value += p * scpsEvaluate(node.children![i]!, hooks);
    }
  } else if (node.type === 'max') {
    value = Math.max(...(node.children?.map((c) => scpsEvaluate(c, hooks)) ?? [0]));
  } else {
    // min
    value = Math.min(...(node.children?.map((c) => scpsEvaluate(c, hooks)) ?? [0]));
  }
  hooks.onEval?.(node.id, node.type, value);
  return value;
}
