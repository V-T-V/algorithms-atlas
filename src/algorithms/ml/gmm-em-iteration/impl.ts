// =============================================================================
// 高斯混合模型（EM 迭代）· 纯算法实现
// 一维 GMM，E 步求责任度，M 步更新参数。
// =============================================================================

export interface GMMComponent {
  mean: number;
  variance: number;
  weight: number;
}

export interface GMMResult {
  components: GMMComponent[];
  /** 每个点对每个分量的责任度（n×K）。 */
  responsibilities: number[][];
  /** 最终对数似然。 */
  logLikelihood: number;
  iterations: number;
  converged: boolean;
}

export interface GMMHooks {
  /** E 步完成（责任度）。 */
  onEStep?: (iter: number, resp: number[][]) => void;
  /** M 步完成（新参数）。 */
  onMStep?: (iter: number, components: GMMComponent[]) => void;
  /** 完成。 */
  onDone?: (result: GMMResult) => void;
}

/** 一维高斯概率密度。 */
function gaussianPdf(x: number, mean: number, variance: number): number {
  if (variance <= 0) return 0;
  const s = Math.sqrt(2 * Math.PI * variance);
  return Math.exp(-((x - mean) ** 2) / (2 * variance)) / s;
}

/** 对数似然。 */
function logLikelihood(data: readonly number[], comps: GMMComponent[]): number {
  let ll = 0;
  for (const x of data) {
    let p = 0;
    for (const c of comps) p += c.weight * gaussianPdf(x, c.mean, c.variance);
    ll += Math.log(Math.max(p, 1e-300));
  }
  return ll;
}

/**
 * 一维 GMM 的 EM 拟合。
 * @param data 一维数据
 * @param k 分量数
 * @param initialMeans 初始均值（可选）
 * @param maxIter 最大迭代数
 * @param tol 对数似然变化 < tol 视为收敛
 */
export function fitGMM(
  data: readonly number[],
  k: number,
  initialMeans?: number[],
  maxIter = 100,
  tol = 1e-6,
  hooks: GMMHooks = {},
): GMMResult {
  const n = data.length;
  if (n === 0)
    return {
      components: [],
      responsibilities: [],
      logLikelihood: 0,
      iterations: 0,
      converged: true,
    };
  if (k < 1) throw new RangeError(`k 须 >= 1，收到 ${k}`);
  if (k > n) throw new RangeError(`k(${k}) 不能大于样本数 ${n}`);

  // 初始化
  const sorted = [...data].sort((a, b) => a - b);
  let components: GMMComponent[];
  if (initialMeans && initialMeans.length === k) {
    const globalVar = varianceOf(data) || 1;
    components = initialMeans.map((m) => ({ mean: m, variance: globalVar, weight: 1 / k }));
  } else {
    // 均匀分位初始化
    const globalVar = varianceOf(data) || 1;
    components = [];
    for (let i = 0; i < k; i++) {
      const q = sorted[Math.floor(((i + 0.5) / k) * (n - 1))]!;
      components.push({ mean: q, variance: globalVar, weight: 1 / k });
    }
  }

  const resp: number[][] = Array.from({ length: n }, () => new Array(k).fill(0));
  let prevLL = -Infinity;
  let converged = false;
  let iter = 0;

  for (; iter < maxIter; iter++) {
    // E 步
    for (let i = 0; i < n; i++) {
      let sum = 0;
      const x = data[i]!;
      for (let c = 0; c < k; c++) {
        const p =
          components[c]!.weight * gaussianPdf(x, components[c]!.mean, components[c]!.variance);
        resp[i]![c] = p;
        sum += p;
      }
      if (sum > 0) for (let c = 0; c < k; c++) resp[i]![c]! /= sum;
    }
    hooks.onEStep?.(
      iter,
      resp.map((r) => [...r]),
    );

    // M 步
    for (let c = 0; c < k; c++) {
      let nk = 0;
      let meanSum = 0;
      for (let i = 0; i < n; i++) {
        nk += resp[i]![c]!;
        meanSum += resp[i]![c]! * data[i]!;
      }
      if (nk < 1e-12) continue; // 避免除零
      const mean = meanSum / nk;
      let varSum = 0;
      for (let i = 0; i < n; i++) varSum += resp[i]![c]! * (data[i]! - mean) ** 2;
      components[c] = { mean, variance: Math.max(varSum / nk, 1e-6), weight: nk / n };
    }
    hooks.onMStep?.(
      iter,
      components.map((c) => ({ ...c })),
    );

    // 收敛判据
    const ll = logLikelihood(data, components);
    if (Math.abs(ll - prevLL) < tol) {
      converged = true;
      prevLL = ll;
      break;
    }
    prevLL = ll;
  }

  const result: GMMResult = {
    components,
    responsibilities: resp,
    logLikelihood: prevLL,
    iterations: iter + 1,
    converged,
  };
  hooks.onDone?.(result);
  return result;
}

function varianceOf(data: readonly number[]): number {
  if (data.length === 0) return 0;
  const m = data.reduce((s, x) => s + x, 0) / data.length;
  return data.reduce((s, x) => s + (x - m) ** 2, 0) / data.length;
}

/** 根据责任度给每个点分配最可能的分量标签。 */
export function assignLabels(resp: number[][]): number[] {
  return resp.map((r) => {
    let best = 0;
    let bestV = -Infinity;
    for (let c = 0; c < r.length; c++) {
      if (r[c]! > bestV) {
        bestV = r[c]!;
        best = c;
      }
    }
    return best;
  });
}
