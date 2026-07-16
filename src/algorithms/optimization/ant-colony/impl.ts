// =============================================================================
// 蚁群算法（Ant Colony Optimization, ACO）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 演示问题：旅行商问题（TSP）—— 求访问所有城市各一次再回到起点的最短回路。
// 随机算法：接受固定种子 rng 保证可复现。
// =============================================================================

/** 一个 TSP 城市（带二维坐标，用于计算欧氏距离 + 可视化）。 */
export interface City {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AntColonyHooks {
  /** 一次迭代结束：给出本代蚂蚁找到的最佳路径长度、当前全局最优长度。 */
  onIteration?: (iter: number, iterBest: number, globalBest: number, bestTour: number[]) => void;
  /** 全部迭代完成。 */
  onFinish?: (bestLength: number, bestTour: number[]) => void;
}

export interface ACOOptions {
  /** 蚂蚁数量。 */
  antCount: number;
  /** 迭代次数。 */
  iterations: number;
  /** 信息素重要程度 α。 */
  alpha: number;
  /** 启发式（能见度）重要程度 β。 */
  beta: number;
  /** 信息素挥发率 ρ ∈ (0,1)。 */
  rho: number;
  /** 信息素总量 Q（用于更新）。 */
  Q: number;
  /** 初始信息素。 */
  initialPheromone: number;
  /** 随机数发生器（[0,1)）。固定种子可复现。 */
  rng: () => number;
}

export interface ACOResult {
  /** 最优回路长度。 */
  bestLength: number;
  /** 最优回路（城市下标序列，首尾不重复回到起点；长度 = 城市数）。 */
  bestTour: number[];
}

/** 欧氏距离。 */
export function dist(a: City, b: City): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 蚁群算法（ACO）求解 TSP。
 *
 * 灵感来自真实蚂蚁觅食：蚂蚁在路径上留下信息素，较短路径上信息素累积更快，
 * 后续蚂蚁更倾向选择信息素浓的路径，形成正反馈从而收敛到（近）最优解。
 *
 * 每只蚂蚁按概率选择下一城市，转移概率：
 *   p(i→j) ∝ τ(i,j)^α · η(i,j)^β
 * 其中 τ 为信息素，η = 1/d(i,j) 为能见度（启发式）。α 大则更依赖群体经验，
 * β 大则更贪心（贪近）。一代蚂蚁全部走完后，按挥发率 ρ 衰减全局信息素，
 * 并让每只蚂蚁在自己走过的路径上沉积 Q/L 的信息素（L 为该蚂蚁回路长度）。
 *
 * @param cities 城市（坐标）
 * @param options 配置（含固定种子 rng）
 * @param hooks 可选的事件钩子
 */
export function antColony(
  cities: readonly City[],
  options: ACOOptions,
  hooks: AntColonyHooks = {},
): ACOResult {
  const n = cities.length;
  if (n < 2) return { bestLength: 0, bestTour: cities.map((_, i) => i) };

  const { antCount, iterations, alpha, beta, rho, Q, initialPheromone, rng } = options;

  // 预计算距离矩阵
  const d: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      d[i]![j] = i === j ? 0 : dist(cities[i]!, cities[j]!);
    }
  }

  // 信息素矩阵 τ[i][j]，初始均匀
  const tau: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(initialPheromone),
  );

  // 启发式 η[i][j] = 1/d（避免除零）
  const eta: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      eta[i]![j] = i === j ? 0 : 1 / Math.max(d[i]![j]!, 1e-9);
    }
  }

  let bestLength = Infinity;
  let bestTour: number[] = [];

  for (let iter = 0; iter < iterations; iter++) {
    let iterBest = Infinity;
    let iterBestTour: number[] = [];

    for (let k = 0; k < antCount; k++) {
      // 每只蚂蚁随机起点
      const start = Math.floor(rng() * n);
      const visited = new Array<boolean>(n).fill(false);
      const tour: number[] = [start];
      visited[start] = true;
      let cur = start;
      let length = 0;

      while (tour.length < n) {
        // 计算转移概率（未访问的城市）
        const probs: number[] = new Array(n).fill(0);
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (!visited[j]!) {
            const w = Math.pow(tau[cur]![j]!, alpha) * Math.pow(eta[cur]![j]!, beta);
            probs[j] = w;
            sum += w;
          }
        }
        // 轮盘赌选择
        let next = -1;
        if (sum <= 0) {
          // 退化：随机选一个未访问的
          const candidates: number[] = [];
          for (let j = 0; j < n; j++) if (!visited[j]!) candidates.push(j);
          next = candidates[Math.floor(rng() * candidates.length)]!;
        } else {
          const r = rng() * sum;
          let acc = 0;
          for (let j = 0; j < n; j++) {
            if (!visited[j]!) {
              acc += probs[j]!;
              if (r <= acc) {
                next = j;
                break;
              }
            }
          }
          if (next === -1) {
            // 浮点兜底：取最后一个未访问
            for (let j = 0; j < n; j++) if (!visited[j]!) next = j;
          }
        }
        visited[next] = true;
        length += d[cur]![next]!;
        cur = next;
        tour.push(cur);
      }
      // 闭合回路回起点
      length += d[cur]![start]!;

      if (length < iterBest) {
        iterBest = length;
        iterBestTour = tour;
      }
      if (length < bestLength) {
        bestLength = length;
        bestTour = [...tour];
      }
    }

    // 信息素挥发：τ ← (1−ρ)·τ
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        tau[i]![j]! *= 1 - rho;
      }
    }
    // 信息素沉积：仅本代最优蚂蚁（加快收敛，常用做法）
    if (iterBestTour.length === n && iterBest < Infinity) {
      const deposit = Q / iterBest;
      for (let i = 0; i < n; i++) {
        const a = iterBestTour[i]!;
        const b = iterBestTour[(i + 1) % n]!;
        tau[a]![b]! += deposit;
        tau[b]![a]! += deposit; // 对称 TSP
      }
    }

    hooks.onIteration?.(iter, iterBest, bestLength, bestTour);
  }

  hooks.onFinish?.(bestLength, bestTour);
  return { bestLength, bestTour };
}

/** mulberry32 伪随机数发生器（确定性）。固定种子保证可复现。 */
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
