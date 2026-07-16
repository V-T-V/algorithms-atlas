// 平均随机梯度 (ASGD) · 实现
export interface AsgdHooks {
  onIter?: (i: number, theta: number[], avgTheta: number[]) => void;
  onConclude?: (avgTheta: number[]) => void;
}
export function averagedSgd(
  gradSampler: () => { grad: number[] },
  d: number,
  lr = 0.05,
  maxIter = 200,
  hooks: AsgdHooks = {},
): number[] {
  const theta = new Array<number>(d).fill(0);
  const avg = new Array<number>(d).fill(0);
  for (let t = 1; t <= maxIter; t++) {
    const { grad } = gradSampler();
    for (let i = 0; i < d; i++) {
      theta[i]! -= lr * grad[i]!;
      avg[i]! += (theta[i]! - avg[i]!) / t;
    }
    hooks.onIter?.(t, [...theta], [...avg]);
  }
  hooks.onConclude?.(avg);
  return avg;
}
