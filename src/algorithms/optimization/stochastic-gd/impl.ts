// =============================================================================
// 随机梯度下降（Stochastic Gradient Descent, SGD）· 纯算法实现（零 DOM 依赖，可独立单测）
// 每次用一个（或小批量）样本的梯度更新参数，使大规模/在线数据可训练。
// 演示问题：线性回归 MSE，拟合 y = 2·x + 1，参数 [w,b] 从 (0,0) 收敛到 (2,1)。
// =============================================================================

/** 单个样本（特征向量 + 标签）。 */
export interface Sample {
  x: number[];
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SGDHooks {
  /** 每个 epoch 结束：轮号、当前参数、本轮平均损失。 */
  onEpoch?: (epoch: number, params: number[], avgLoss: number) => void;
  /** 每处理一个样本：该样本损失、梯度。 */
  onSample?: (sampleIdx: number, loss: number, grad: number[]) => void;
}

/** SGD 返回结果。 */
export interface SGDResult {
  params: number[];
  /** 最终（全样本）平均损失。 */
  loss: number;
  epochs: number;
  converged: boolean;
}

/**
 * 随机梯度下降。
 *
 * 与批量梯度下降（一次用全部样本算平均梯度）不同，SGD **每见一个样本就更新一次**：
 *
 * `for each sample s: params ← params − lr · ∇ℓ(s; params)`
 *
 * 一个 epoch = 遍历一遍所有样本。本实现**按顺序遍历**（确定性，便于可视化与单测）。
 *
 * - 单步代价 `O(d)`（d 维参数），远低于批量的 `O(n·d)`
 * - 梯度有噪声（方差大）→ 轨迹锯齿，但能**逃离尖锐局部极小**，常泛化更好
 * - 收敛是「亚线性」的，靠近极小后难以精确停下（需学习率衰减）
 *
 * 演示：拟合 `y = 2x + 1`，`stochasticGd(demoLoss, demoSampleGrad, [0,0])` 收敛到 `[2, 1]`。
 *
 * 时间复杂度 `O(e·n·d)`（e 轮、n 样本、d 维），空间 `O(d)`。
 *
 * @param lossOnSample 单样本损失 ℓ(params, s)
 * @param gradOnSample 单样本梯度 ∇ℓ(params, s)
 * @param initParams 初始参数
 * @param samples 训练样本
 * @param options lr、maxEpoch、tol（平均损失变化阈值）
 * @param hooks 可选的事件钩子
 */
export function stochasticGd(
  lossOnSample: (params: number[], s: Sample) => number,
  gradOnSample: (params: number[], s: Sample) => number[],
  initParams: number[],
  samples: readonly Sample[],
  options: { lr?: number; maxEpoch?: number; tol?: number } = {},
  hooks: SGDHooks = {},
): SGDResult {
  const { lr = 0.05, maxEpoch = 200, tol = 1e-8 } = options;
  const params = [...initParams];
  let prevAvg = Infinity;
  let epochs = 0;
  let converged = false;

  const avgLoss = (): number =>
    samples.reduce((s, samp) => s + lossOnSample(params, samp), 0) / Math.max(samples.length, 1);

  for (let epoch = 1; epoch <= maxEpoch; epoch++) {
    for (let si = 0; si < samples.length; si++) {
      const s = samples[si]!;
      const g = gradOnSample(params, s);
      hooks.onSample?.(si, lossOnSample(params, s), g);
      for (let i = 0; i < params.length; i++) params[i]! -= lr * g[i]!;
    }
    const avg = avgLoss();
    hooks.onEpoch?.(epoch, [...params], avg);
    epochs = epoch;
    if (Math.abs(avg - prevAvg) < tol) {
      converged = true;
      break;
    }
    prevAvg = avg;
  }

  return { params, loss: avgLoss(), epochs, converged };
}

/** 演示：线性回归 y = w·x + b，拟合真值 y = 2x + 1。样本点 [x, y]。 */
export const demoSamples: Sample[] = [
  { x: [0], y: 1 },
  { x: [1], y: 3 },
  { x: [2], y: 5 },
  { x: [3], y: 7 },
];

/** 单样本平方损失：(1/2)(w·x + b − y)²。 */
export function lossOnSample(params: number[], s: Sample): number {
  const pred = params[0]! * s.x[0]! + params[1]!;
  return 0.5 * (pred - s.y) ** 2;
}

/** 单样本损失梯度 ∇ = (pred − y)·[x, 1]。 */
export function gradOnSample(params: number[], s: Sample): number[] {
  const pred = params[0]! * s.x[0]! + params[1]!;
  const err = pred - s.y;
  return [err * s.x[0]!, err];
}
