// =============================================================================
// XGBoost 简化版 · 纯算法实现
// 二阶梯度提升回归树：用平方损失的 g, h（g=ŷ−y, h=1），
// 按 XGBoost 公式计算叶子权重与分裂增益，目标含 L2 正则 λ 与叶子罚 γ。
// =============================================================================

/** 一棵单变量（按某特征阈值二分）回归树。 */
export interface TreeNode {
  leaf: boolean;
  /** 叶子权重（leaf=true 时有效）。 */
  weight?: number;
  /** 内节点：分裂特征索引与阈值。 */
  feature?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

export interface XGBoostResult {
  /** 提升树序列。 */
  trees: TreeNode[];
  /** 学习率。 */
  learningRate: number;
  /** 初始预测（基线）。 */
  baseScore: number;
  /** 训练集预测值。 */
  predictions: number[];
  /** 每轮后的训练 RMSE。 */
  rmseHistory: number[];
  /** 每棵树的叶子数。 */
  leafCounts: number[];
}

export interface XGBoostHooks {
  onRound?: (round: number, rmse: number, tree: TreeNode) => void;
}

export interface XGBoostOptions {
  /** 提升轮数。默认 20。 */
  rounds?: number;
  /** 学习率（步长收缩）。默认 0.3。 */
  learningRate?: number;
  /** L2 正则 λ。默认 1。 */
  lambda?: number;
  /** 叶子数罚 γ。默认 0。 */
  gamma?: number;
  /** 树最大深度。默认 3。 */
  maxDepth?: number;
  /** 分裂所需最小样本数。默认 2。 */
  minChildWeight?: number;
}

/** 平方损失：g = ŷ − y, h = 1。 */
function gradients(predictions: number[], y: number[]): { g: number[]; h: number[] } {
  return {
    g: predictions.map((p, i) => p - y[i]!),
    h: new Array(predictions.length).fill(1),
  };
}

interface Split {
  feature: number;
  threshold: number;
  gain: number;
}
interface IndexRange {
  indices: number[];
}

const NO_SPLIT: Split = { feature: -1, threshold: 0, gain: -Infinity };

/**
 * 在一组样本（索引 + 特征值）上找最佳分裂。
 * 使用 XGBoost 增益公式：½[G_L²/(H_L+λ) + G_R²/(H_R+λ) − G²/(H+λ)] − γ。
 */
function bestSplit(
  X: number[][],
  g: number[],
  h: number[],
  range: IndexRange,
  lambda: number,
  gamma: number,
  maxDepth: number,
  depth: number,
  minChildWeight: number,
): Split {
  if (depth >= maxDepth || range.indices.length < 2) return NO_SPLIT;
  const n = X[0]?.length ?? 0;
  let best = NO_SPLIT;

  const G = range.indices.reduce((s, i) => s + g[i]!, 0);
  const H = range.indices.reduce((s, i) => s + h[i]!, 0);

  for (let f = 0; f < n; f++) {
    // 按特征 f 排序
    const sorted = [...range.indices].sort((a, b) => X[a]![f]! - X[b]![f]!);
    let GL = 0,
      HL = 0;
    for (let k = 0; k < sorted.length - 1; k++) {
      const idx = sorted[k]!;
      GL += g[idx]!;
      HL += h[idx]!;
      const mid = (X[idx]![f]! + X[sorted[k + 1]!]![f]!) / 2;
      // 不在相同值之间分裂
      if (X[idx]![f]! === X[sorted[k + 1]!]![f]!) continue;
      const GR = G - GL;
      const HR = H - HL;
      if (HL < minChildWeight || HR < minChildWeight) continue;
      const gain =
        0.5 * ((GL * GL) / (HL + lambda) + (GR * GR) / (HR + lambda) - (G * G) / (H + lambda)) -
        gamma;
      if (gain > best.gain) best = { feature: f, threshold: mid, gain };
    }
  }
  return best;
}

/** 递归建树。 */
function buildTree(
  X: number[][],
  g: number[],
  h: number[],
  range: IndexRange,
  lambda: number,
  gamma: number,
  depth: number,
  maxDepth: number,
  minChildWeight: number,
): TreeNode {
  const split = bestSplit(X, g, h, range, lambda, gamma, maxDepth, depth, minChildWeight);
  if (split.gain <= 0) {
    // 叶子：w = -G/(H+λ)
    const G = range.indices.reduce((s, i) => s + g[i]!, 0);
    const H = range.indices.reduce((s, i) => s + h[i]!, 0);
    return { leaf: true, weight: -G / (H + lambda) };
  }
  const left: number[] = [];
  const right: number[] = [];
  for (const i of range.indices) {
    if (X[i]![split.feature]! <= split.threshold) left.push(i);
    else right.push(i);
  }
  return {
    leaf: false,
    feature: split.feature,
    threshold: split.threshold,
    left: buildTree(X, g, h, { indices: left }, lambda, gamma, depth + 1, maxDepth, minChildWeight),
    right: buildTree(
      X,
      g,
      h,
      { indices: right },
      lambda,
      gamma,
      depth + 1,
      maxDepth,
      minChildWeight,
    ),
  };
}

/** 单树预测（返回叶子权重）。 */
function treePredict(tree: TreeNode, x: number[]): number {
  if (tree.leaf) return tree.weight ?? 0;
  if (x[tree.feature!]! <= tree.threshold!) return treePredict(tree.left!, x);
  return treePredict(tree.right!, x);
}

/** 统计叶子数。 */
function countLeaves(tree: TreeNode): number {
  if (tree.leaf) return 1;
  return countLeaves(tree.left!) + countLeaves(tree.right!);
}

/**
 * XGBoost 简化版（平方损失 + L2 正则）。
 *
 * @param X 特征矩阵 n×d
 * @param y 目标值 n
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function xgboost(
  X: number[][],
  y: number[],
  options: XGBoostOptions = {},
  hooks: XGBoostHooks = {},
): XGBoostResult {
  const rounds = options.rounds ?? 20;
  const learningRate = options.learningRate ?? 0.3;
  const lambda = options.lambda ?? 1;
  const gamma = options.gamma ?? 0;
  const maxDepth = options.maxDepth ?? 3;
  const minChildWeight = options.minChildWeight ?? 1;

  const n = X.length;
  if (n === 0) {
    return {
      trees: [],
      learningRate,
      baseScore: 0,
      predictions: [],
      rmseHistory: [],
      leafCounts: [],
    };
  }

  const baseScore = y.reduce((s, v) => s + v, 0) / n; // 初始化为均值
  const predictions = new Array<number>(n).fill(baseScore);
  const trees: TreeNode[] = [];
  const rmseHistory: number[] = [];
  const leafCounts: number[] = [];

  for (let r = 0; r < rounds; r++) {
    const { g, h } = gradients(predictions, y);
    const tree = buildTree(
      X,
      g,
      h,
      { indices: Array.from({ length: n }, (_, i) => i) },
      lambda,
      gamma,
      0,
      maxDepth,
      minChildWeight,
    );
    trees.push(tree);
    leafCounts.push(countLeaves(tree));
    // 更新预测
    for (let i = 0; i < n; i++) predictions[i]! += learningRate * treePredict(tree, X[i]!);
    let sse = 0;
    for (let i = 0; i < n; i++) sse += (predictions[i]! - y[i]!) ** 2;
    const rmse = Math.sqrt(sse / n);
    rmseHistory.push(rmse);
    hooks.onRound?.(r, rmse, tree);
  }

  return { trees, learningRate, baseScore, predictions, rmseHistory, leafCounts };
}

/** 演示数据：y = 2x1 + 0.5x2 + 噪声（无噪声便于断言）。 */
export function demoData(): { X: number[][]; y: number[] } {
  const X = [
    [1, 2],
    [2, 1],
    [3, 4],
    [4, 3],
    [5, 5],
    [6, 2],
  ];
  const y = [
    2 * 1 + 0.5 * 2,
    2 * 2 + 0.5 * 1,
    2 * 3 + 0.5 * 4,
    2 * 4 + 0.5 * 3,
    2 * 5 + 0.5 * 5,
    2 * 6 + 0.5 * 2,
  ];
  return { X, y };
}
