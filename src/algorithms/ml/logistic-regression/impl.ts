// =============================================================================
// 逻辑回归 Logistic Regression（梯度下降）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每轮迭代的参数与损失，供录制器使用。
// 用确定性 RNG（mulberry32）初始化权重，保证 buildTrace 与测试可复现。
// =============================================================================

/** 一个带标签的二维特征点（label ∈ {0,1}）。 */
export interface LabeledPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

export interface LogisticResult {
  /** 权重向量 [w0, w1]（对应特征 x, y）。 */
  weights: number[];
  /** 偏置。 */
  bias: number;
  /** 训练过程中的损失序列（每轮一次，交叉熵）。 */
  losses: number[];
  /** 训练数据上的准确率（用 0.5 阈值）。 */
  accuracy: number;
  /** 实际迭代轮数。 */
  iterations: number;
  /** 是否达到收敛阈值。 */
  converged: boolean;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LogisticHooks {
  /** 第 iter 轮开始（当前参数 w, b）。 */
  onIteration?: (iter: number, weights: number[], bias: number) => void;
  /** 算完本轮损失 loss。 */
  onLoss?: (iter: number, loss: number) => void;
  /** 计算完本轮梯度后更新参数（新 w, b）。 */
  onUpdate?: (iter: number, weights: number[], bias: number) => void;
  /** 训练结束。 */
  onConverge?: (result: LogisticResult) => void;
}

/** mulberry32 伪随机数发生器（与 kmeans 共用约定）。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** sigmoid：数值稳定版，避免大正/负值溢出。 */
export function sigmoid(z: number): number {
  if (z >= 0) {
    const e = Math.exp(-z);
    return 1 / (1 + e);
  }
  const e = Math.exp(z);
  return e / (1 + e);
}

export interface LogisticOptions {
  /** 学习率。默认 0.1。 */
  learningRate?: number;
  /** 最大迭代轮数。默认 500。 */
  maxIterations?: number;
  /** 损失变化阈值（小于则收敛）。默认 1e-6。 */
  tolerance?: number;
  /** 初始化种子。默认 42。 */
  seed?: number;
  /** L2 正则系数（0 = 不正则）。默认 0。 */
  l2?: number;
}

/**
 * 二分类逻辑回归（批量梯度下降）。
 *
 * 模型：`p(y=1|x) = σ(w·x + b)`，损失为二元交叉熵：
 *   L = −(1/n) Σ [ y·log(p) + (1−y)·log(1−p) ]
 * 梯度：对 w_j 为 (1/n) Σ (p − y)·x_j；对 b 为 (1/n) Σ (p − y)。
 *
 * @param data 训练数据（二维特征 + 0/1 标签）
 * @param options 训练配置
 * @param hooks 可选事件钩子
 */
export function logisticRegression(
  data: LabeledPoint[],
  options: LogisticOptions = {},
  hooks: LogisticHooks = {},
): LogisticResult {
  const lr = options.learningRate ?? 0.1;
  const maxIterations = options.maxIterations ?? 500;
  const tolerance = options.tolerance ?? 1e-6;
  const seed = options.seed ?? 42;
  const l2 = options.l2 ?? 0;
  const rng = mulberry32(seed);

  const n = data.length;
  const weights = [rng() * 0.2 - 0.1, rng() * 0.2 - 0.1]; // 小随机初值 ∈ [-0.1, 0.1)
  let bias = rng() * 0.2 - 0.1;
  const losses: number[] = [];
  let prevLoss = Infinity;
  let converged = false;
  let iter = 0;

  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(iter, [...weights], bias);

    // 前向：每个点的预测概率
    const probs = data.map((p) => sigmoid(weights[0]! * p.x + weights[1]! * p.y + bias));

    // 交叉熵损失（含 L2）
    let loss = 0;
    for (let i = 0; i < n; i++) {
      const y = data[i]!.label;
      const p = probs[i]!;
      // 裁剪避免 log(0)
      const pc = Math.min(Math.max(p, 1e-12), 1 - 1e-12);
      loss += -(y * Math.log(pc) + (1 - y) * Math.log(1 - pc));
    }
    loss /= n;
    if (l2 > 0) loss += 0.5 * l2 * (weights[0]! ** 2 + weights[1]! ** 2);
    losses.push(loss);
    hooks.onLoss?.(iter, loss);

    // 收敛判定
    if (Math.abs(prevLoss - loss) < tolerance) {
      converged = true;
      break;
    }
    prevLoss = loss;

    // 梯度
    let g0 = 0,
      g1 = 0,
      gb = 0;
    for (let i = 0; i < n; i++) {
      const err = probs[i]! - data[i]!.label;
      g0 += err * data[i]!.x;
      g1 += err * data[i]!.y;
      gb += err;
    }
    g0 = g0 / n + l2 * weights[0]!;
    g1 = g1 / n + l2 * weights[1]!;
    gb = gb / n;

    // 参数更新
    weights[0] = weights[0]! - lr * g0;
    weights[1] = weights[1]! - lr * g1;
    bias -= lr * gb;
    hooks.onUpdate?.(iter, [...weights], bias);
  }

  // 准确率
  let correct = 0;
  for (const p of data) {
    const prob = sigmoid(weights[0]! * p.x + weights[1]! * p.y + bias);
    const pred = prob >= 0.5 ? 1 : 0;
    if (pred === p.label) correct++;
  }
  const accuracy = n === 0 ? 0 : correct / n;

  const result: LogisticResult = {
    weights,
    bias,
    losses,
    accuracy,
    iterations: iter,
    converged: converged || iter >= maxIterations,
  };
  hooks.onConverge?.(result);
  return result;
}

/** 用训练好的模型预测单个点的类别（0/1）。 */
export function predictLabel(result: LogisticResult, x: number, y: number): 0 | 1 {
  return sigmoid(result.weights[0]! * x + result.weights[1]! * y + result.bias) >= 0.5 ? 1 : 0;
}

/** 用训练好的模型预测概率 p(y=1)。 */
export function predictProb(result: LogisticResult, x: number, y: number): number {
  return sigmoid(result.weights[0]! * x + result.weights[1]! * y + result.bias);
}
