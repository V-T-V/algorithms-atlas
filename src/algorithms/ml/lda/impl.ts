// =============================================================================
// 线性判别分析（LDA）· 纯算法实现
// 二类 LDA：w ∝ S_W⁻¹(μ1 − μ0)；分类按投影阈值。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface LDAResult {
  /** 判别方向 w（已归一化）。 */
  weights: number[];
  /** 投影阈值（两类均值的投影中点）。 */
  threshold: number;
  /** 类 0 均值。 */
  mean0: number[];
  /** 类 1 均值。 */
  mean1: number[];
  /** 投影后的训练样本（用于可视化）。 */
  projections: number[];
  /** 训练准确率。 */
  accuracy: number;
}

export interface LDAHooks {
  onMean?: (mean0: number[], mean1: number[]) => void;
  onScatter?: (SW: number[][]) => void;
  onWeights?: (weights: number[]) => void;
}

export interface LDAOptions {
  /** 正则项（防 S_W 奇异）。默认 1e-4。 */
  regularization?: number;
}

/** 矩阵求逆（高斯-约旦）。 */
function matInverse(m: number[][], reg = 0): number[][] {
  const n = m.length;
  const a = m.map((row) => row.map((v) => v));
  if (reg > 0) for (let i = 0; i < n; i++) a[i]![i]! += reg;
  const aug = a.map((row, i) => {
    const id = new Array<number>(n).fill(0);
    id[i] = 1;
    return [...row, ...id];
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    let maxAbs = Math.abs(aug[col]![col]!);
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(aug[r]![col]!) > maxAbs) {
        maxAbs = Math.abs(aug[r]![col]!);
        pivot = r;
      }
    }
    [aug[col], aug[pivot]] = [aug[pivot]!, aug[col]!];
    const pv = aug[col]![col]!;
    if (Math.abs(pv) < 1e-14) throw new Error('奇异矩阵 / singular');
    for (let j = 0; j < 2 * n; j++) aug[col]![j]! /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = aug[r]![col]!;
      for (let j = 0; j < 2 * n; j++) aug[r]![j]! -= factor * aug[col]![j]!;
    }
  }
  return aug.map((row) => row.slice(n));
}

function matVec(m: number[][], v: number[]): number[] {
  return m.map((row) => row.reduce((s, mv, idx) => s + mv * v[idx]!, 0));
}

/** 计算 n 个向量的均值。 */
function meanOf(rows: number[][]): number[] {
  const d = rows[0]?.length ?? 0;
  const m = new Array<number>(d).fill(0);
  for (const r of rows) for (let j = 0; j < d; j++) m[j]! += r[j]!;
  return m.map((v) => v / rows.length);
}

/**
 * 二类线性判别分析。
 *
 * @param X 特征矩阵 n×d
 * @param labels 类别标签（仅取前两类 0/1）
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function lda(
  X: number[][],
  labels: number[],
  options: LDAOptions = {},
  hooks: LDAHooks = {},
): LDAResult {
  const reg = options.regularization ?? 1e-4;
  const n = X.length;
  const d = X[0]?.length ?? 0;
  if (n === 0) {
    return { weights: [], threshold: 0, mean0: [], mean1: [], projections: [], accuracy: 0 };
  }

  const X0 = X.filter((_, i) => labels[i] === 0);
  const X1 = X.filter((_, i) => labels[i] === 1);
  if (X0.length === 0 || X1.length === 0) {
    throw new Error('LDA 需要两个非空类 / LDA needs two non-empty classes');
  }

  const mean0 = meanOf(X0);
  const mean1 = meanOf(X1);
  hooks.onMean?.([...mean0], [...mean1]);

  // 类内散度 S_W = Σ_{c} Σ_{i∈c} (x_i − μ_c)(x_i − μ_c)ᵀ
  const SW: number[][] = Array.from({ length: d }, () => new Array<number>(d).fill(0));
  const accumulate = (rows: number[][], mean: number[]): void => {
    for (const r of rows) {
      for (let a = 0; a < d; a++) {
        for (let b = 0; b < d; b++) {
          SW[a]![b]! += (r[a]! - mean[a]!) * (r[b]! - mean[b]!);
        }
      }
    }
  };
  accumulate(X0, mean0);
  accumulate(X1, mean1);
  hooks.onScatter?.(SW.map((r) => [...r]));

  // w ∝ S_W⁻¹(μ1 − μ0)
  const diff = mean1.map((v, j) => v - mean0[j]!);
  const SWinv = matInverse(SW, reg);
  let w = matVec(SWinv, diff);

  // 归一化
  const norm = Math.sqrt(w.reduce((s, v) => s + v * v, 0)) || 1;
  w = w.map((v) => v / norm);
  hooks.onWeights?.([...w]);

  // 投影与阈值
  const projections = X.map((row) => row.reduce((s, v, j) => s + v * w[j]!, 0));
  const p0 = mean0.reduce((s, v, j) => s + v * w[j]!, 0);
  const p1 = mean1.reduce((s, v, j) => s + v * w[j]!, 0);
  const threshold = (p0 + p1) / 2;

  // 准确率：投影 ≥ threshold 判为类 1（若 p1 > p0）
  const class1Higher = p1 > p0;
  let correct = 0;
  for (let i = 0; i < n; i++) {
    const predicted = projections[i]! >= threshold ? (class1Higher ? 1 : 0) : class1Higher ? 0 : 1;
    if (predicted === labels[i]) correct++;
  }
  const accuracy = correct / n;

  return { weights: w, threshold, mean0, mean1, projections, accuracy };
}

/** 演示数据：两类可分。 */
export function demoData(): { X: number[][]; y: number[] } {
  const X = [
    [1, 1],
    [1.5, 1.2],
    [1.2, 1.8],
    [5, 5],
    [5.5, 4.8],
    [4.8, 5.3],
  ];
  const y = [0, 0, 0, 1, 1, 1];
  return { X, y };
}
