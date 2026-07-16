// TD-Leaf 学习 · 实现

export interface TdLeafHooks {
  onLeaf?: (step: number, value: number) => void;
  onUpdate?: (step: number, tdError: number, weightNorm: number) => void;
}

/**
 * TD-Leaf(λ)：沿叶子估值序列做 TD 学习，更新线性评估器权重。
 * @param leafFeatures 每步主路径叶子的特征向量
 * @param leafValues 每步主路径叶子的估值（= w · features）
 * @param weights 初始权重（会被原地更新）
 * @param rewards 每步实际奖励（终局非零）
 * @param gamma 折扣
 * @param lambda 资格迹参数
 * @param alpha 学习率
 */
export function tdLeafLearn(
  leafFeatures: number[][],
  leafValues: number[],
  weights: number[],
  rewards: number[],
  gamma: number,
  lambda: number,
  alpha: number,
  hooks: TdLeafHooks = {},
): number[] {
  const T = leafFeatures.length;
  if (T === 0) return weights;
  const fLen = weights.length;
  // 资格迹
  const traces = new Array<number>(fLen).fill(0);

  for (let t = 0; t < T - 1; t++) {
    const cur = leafValues[t]!;
    const next = leafValues[t + 1]!;
    const r = rewards[t] ?? 0;
    const tdTarget = r + gamma * next;
    const tdError = tdTarget - cur;
    hooks.onLeaf?.(t, cur);

    // 更新资格迹（基于当前叶子特征的梯度）
    for (let i = 0; i < fLen; i++) {
      traces[i] = gamma * lambda * traces[i]! + leafFeatures[t]![i]!;
    }
    // 更新权重
    let norm = 0;
    for (let i = 0; i < fLen; i++) {
      weights[i] = weights[i]! + alpha * tdError * traces[i]!;
      norm += weights[i]! * weights[i]!;
    }
    hooks.onUpdate?.(t, tdError, Math.sqrt(norm));
  }
  return weights;
}

/** 线性评估：w · features。 */
export function evaluate(weights: number[], features: number[]): number {
  let s = 0;
  for (let i = 0; i < weights.length; i++) s += weights[i]! * (features[i] ?? 0);
  return s;
}
