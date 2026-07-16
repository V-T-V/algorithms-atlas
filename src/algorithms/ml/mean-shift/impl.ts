// =============================================================================
// Mean-Shift 均值漂移聚类 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 二维数据点。 */
export interface Point {
  x: number;
  y: number;
}

export interface MeanShiftResult {
  /** 每个点收敛后的位置（mode 附近）。 */
  shifted: Point[];
  /** 每个点所属簇编号（mode 合并后）。 */
  assignments: number[];
  /** 各簇的代表 mode。 */
  modes: Point[];
  /** 是否收敛。 */
  converged: boolean;
  /** 实际迭代轮数。 */
  iterations: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MeanShiftHooks {
  /** 一轮迭代开始。 */
  onIteration?: (iter: number, points: Point[]) => void;
  /** 第 i 个点本轮漂移后的新位置。 */
  onShift?: (i: number, from: Point, to: Point, points: Point[]) => void;
}

export interface MeanShiftOptions {
  /** 带宽（核宽度 h）。 */
  bandwidth: number;
  /** 最大迭代轮数。默认 50。 */
  maxIterations?: number;
  /** 单点位移阈值（小于则认为该点收敛）。默认 1e-3。 */
  tolerance?: number;
  /** mode 合并阈值（两点距离小于此值视为同一簇）。默认 bandwidth/2。 */
  mergeTolerance?: number;
}

/**
 * Mean-Shift 均值漂移聚类（高斯核）。
 *
 * @param points 数据点
 * @param options 配置
 * @param hooks 可选事件钩子
 */
export function meanShift(
  points: Point[],
  options: MeanShiftOptions,
  hooks: MeanShiftHooks = {},
): MeanShiftResult {
  const { bandwidth } = options;
  const maxIterations = options.maxIterations ?? 50;
  const tolerance = options.tolerance ?? 1e-3;
  const mergeTolerance = options.mergeTolerance ?? bandwidth / 2;
  const h2 = bandwidth * bandwidth;

  const n = points.length;
  if (n === 0) {
    return { shifted: [], assignments: [], modes: [], converged: true, iterations: 0 };
  }

  // 每个点都从自身开始漂移
  let current = points.map((p) => ({ x: p.x, y: p.y }));

  let converged = false;
  let iter = 0;
  for (; iter < maxIterations; iter++) {
    hooks.onIteration?.(
      iter,
      current.map((c) => ({ ...c })),
    );

    const next: Point[] = new Array(n);
    let maxMove = 0;
    for (let i = 0; i < n; i++) {
      const pi = current[i]!;
      // 加权均值（高斯核）
      let sumX = 0,
        sumY = 0,
        sumW = 0;
      for (let j = 0; j < n; j++) {
        const pj = current[j]!;
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const d2 = dx * dx + dy * dy;
        const w = Math.exp(-d2 / (2 * h2));
        sumX += pj.x * w;
        sumY += pj.y * w;
        sumW += w;
      }
      const nx = sumX / sumW;
      const ny = sumY / sumW;
      const move = Math.hypot(nx - pi.x, ny - pi.y);
      if (move > maxMove) maxMove = move;
      next[i] = { x: nx, y: ny };
      hooks.onShift?.(
        i,
        { ...pi },
        { x: nx, y: ny },
        current.map((c) => ({ ...c })),
      );
    }
    current = next;

    if (maxMove < tolerance) {
      converged = true;
      iter++;
      break;
    }
  }

  // 合并相近的收敛点为簇（mode）
  const modes: Point[] = [];
  const assignments = new Array<number>(n).fill(-1);
  for (let i = 0; i < n; i++) {
    const pi = current[i]!;
    let found = -1;
    for (let m = 0; m < modes.length; m++) {
      const md = modes[m]!;
      if (Math.hypot(pi.x - md.x, pi.y - md.y) < mergeTolerance) {
        found = m;
        break;
      }
    }
    if (found === -1) {
      modes.push({ ...pi });
      assignments[i] = modes.length - 1;
    } else {
      assignments[i] = found;
    }
  }

  return {
    shifted: current,
    assignments,
    modes,
    converged: converged || iter >= maxIterations,
    iterations: iter,
  };
}
