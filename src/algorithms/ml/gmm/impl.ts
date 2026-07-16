// =============================================================================
// 高斯混合模型（EM 算法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 为简化与稳定性：协方差取对角（每维独立方差），数值上对 log 加 epsilon 防退化。
// =============================================================================

/** 二维数据点。 */
export interface Point {
  x: number;
  y: number;
}

/** 一个高斯分量的参数（2D 对角协方差）。 */
export interface Component {
  /** 混合权重 π_k。 */
  weight: number;
  /** 均值向量。 */
  mean: Point;
  /** 各维方差（对角协方差）。 */
  variance: Point;
}

export interface GMMResult {
  /** 最终分量参数。 */
  components: Component[];
  /** 每个点对每个分量的归属概率（软分配）。 */
  responsibilities: number[][];
  /** 每个点最可能的簇编号（硬分配）。 */
  assignments: number[];
  /** 最终对数似然。 */
  logLikelihood: number;
  /** 是否收敛。 */
  converged: boolean;
  /** 实际迭代轮数。 */
  iterations: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GMMHooks {
  /** 一轮 EM 迭代开始。 */
  onIteration?: (iter: number, components: Component[], logLikelihood: number) => void;
  /** E 步完成，得到归属矩阵。 */
  onEStep?: (iter: number, responsibilities: number[][]) => void;
  /** M 步完成，更新分量。 */
  onMStep?: (iter: number, components: Component[]) => void;
}

/** mulberry32 伪随机数发生器（确定性）。 */
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

export interface GMMOptions {
  /** 分量数。 */
  k: number;
  /** 最大迭代轮数。默认 100。 */
  maxIterations?: number;
  /** 对数似然变化阈值。默认 1e-6。 */
  tolerance?: number;
  /** 随机数发生器。默认 mulberry32(42)。 */
  rng?: () => number;
  /** 初始化种子（仅当未提供 rng 时生效）。默认 42。 */
  seed?: number;
}

/** 一维高斯密度（对角协方差下每维独立）。 */
function gaussian1d(x: number, mean: number, variance: number): number {
  const denom = Math.sqrt(2 * Math.PI * variance);
  const exp = Math.exp(-((x - mean) ** 2) / (2 * variance));
  return exp / denom;
}

/** 分量 k 在点 p 处的加权密度（对角协方差 = 两维独立相乘）。 */
function weightedDensity(p: Point, c: Component): number {
  const px = gaussian1d(p.x, c.mean.x, c.variance.x);
  const py = gaussian1d(p.y, c.mean.y, c.variance.y);
  return c.weight * px * py;
}

/**
 * 高斯混合模型 EM 算法（2D 对角协方差）。
 *
 * @param points 数据点
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function gmm(points: Point[], options: GMMOptions, hooks: GMMHooks = {}): GMMResult {
  const { k } = options;
  const maxIterations = options.maxIterations ?? 100;
  const tolerance = options.tolerance ?? 1e-6;
  const rng = options.rng ?? mulberry32(options.seed ?? 42);

  const n = points.length;
  if (n === 0 || k <= 0) {
    return {
      components: [],
      responsibilities: [],
      assignments: [],
      logLikelihood: 0,
      converged: true,
      iterations: 0,
    };
  }

  // 初始化：权重均匀，均值随机选 k 个数据点，方差取整体方差
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  const varX = Math.max(points.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / n, 1e-3);
  const varY = Math.max(points.reduce((s, p) => s + (p.y - meanY) ** 2, 0) / n, 1e-3);

  const pool = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (n - i));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  const components: Component[] = [];
  for (let c = 0; c < k; c++) {
    const seed = points[pool[c]!]!;
    components.push({
      weight: 1 / k,
      mean: { x: seed.x, y: seed.y },
      variance: { x: varX, y: varY },
    });
  }

  let prevLL = -Infinity;
  let responsibilities: number[][] = [];
  let converged = false;
  let iter = 0;
  let lastLL = -Infinity;

  for (; iter < maxIterations; iter++) {
    // —— E 步 ——
    responsibilities = new Array(n);
    let logLikelihood = 0;
    for (let i = 0; i < n; i++) {
      const pi = points[i]!;
      const dens = components.map((c) => weightedDensity(pi, c));
      const sum = dens.reduce((s, d) => s + d, 0);
      logLikelihood += Math.log(Math.max(sum, 1e-300));
      responsibilities[i] = dens.map((d) => (sum > 0 ? d / sum : 1 / k));
    }
    lastLL = logLikelihood;
    hooks.onEStep?.(
      iter,
      responsibilities.map((r) => [...r]),
    );
    hooks.onIteration?.(
      iter,
      components.map((c) => ({ ...c, mean: { ...c.mean }, variance: { ...c.variance } })),
      logLikelihood,
    );

    // —— M 步 ——
    const Nk = new Array<number>(k).fill(0);
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < k; c++) Nk[c]! += responsibilities[i]![c]!;
    }
    for (let c = 0; c < k; c++) {
      const nk = Math.max(Nk[c]!, 1e-10);
      let mx = 0,
        my = 0;
      for (let i = 0; i < n; i++) {
        const r = responsibilities[i]![c]!;
        mx += r * points[i]!.x;
        my += r * points[i]!.y;
      }
      mx /= nk;
      my /= nk;
      let vx = 0,
        vy = 0;
      for (let i = 0; i < n; i++) {
        const r = responsibilities[i]![c]!;
        vx += r * (points[i]!.x - mx) ** 2;
        vy += r * (points[i]!.y - my) ** 2;
      }
      vx = Math.max(vx / nk, 1e-3);
      vy = Math.max(vy / nk, 1e-3);
      components[c] = {
        weight: Nk[c]! / n,
        mean: { x: mx, y: my },
        variance: { x: vx, y: vy },
      };
    }
    hooks.onMStep?.(
      iter,
      components.map((c) => ({ ...c, mean: { ...c.mean }, variance: { ...c.variance } })),
    );

    if (Math.abs(logLikelihood - prevLL) < tolerance) {
      converged = true;
      iter++;
      break;
    }
    prevLL = logLikelihood;
  }

  // 硬分配
  const assignments = responsibilities.map((r) => {
    let best = 0;
    let bestP = -1;
    for (let c = 0; c < k; c++) {
      if (r![c]! > bestP) {
        bestP = r![c]!;
        best = c;
      }
    }
    return best;
  });

  return {
    components,
    responsibilities,
    assignments,
    logLikelihood: lastLL,
    converged: converged || iter >= maxIterations,
    iterations: iter,
  };
}
