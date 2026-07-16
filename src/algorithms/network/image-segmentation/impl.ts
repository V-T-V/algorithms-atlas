// =============================================================================
// 图像分割（s-t 最小割）· 纯算法实现
// 1. 把像素网格 + 邻域边 + 终端边建图
// 2. 跑 Edmonds-Karp 最大流 = 最小割
// 3. 在残量图上从 s 做 BFS 区分前后景
// =============================================================================

export interface Pixel {
  /** 像素灰度/颜色值（0..255，单一通道）。 */
  value: number;
  /** 该像素的扁平索引（0..rows*cols-1）。 */
  idx: number;
}

export interface SegInput {
  /** 网格高度。 */
  rows: number;
  /** 网格宽度。 */
  cols: number;
  /** 像素值（按行优先展开，长度 = rows*cols）。 */
  pixels: number[];
  /** 前景种子像素的扁平索引集合（硬约束：必为前景）。 */
  fgSeeds?: number[];
  /** 背景种子像素的扁平索引集合（硬约束：必为背景）。 */
  bgSeeds?: number[];
  /** σ：邻域平滑项的高斯尺度（越大越平滑）。 */
  sigma?: number;
  /** λ：终端项权重系数（越大越受种子/颜色影响）。 */
  lambda?: number;
}

export interface SegHooks {
  onBuildGraph?: (nodeCount: number, source: number, sink: number, edgeCount: number) => void;
  onCut?: (maxFlow: number, foreground: number[]) => void;
  onDone?: (labels: number[], foregroundCount: number, backgroundCount: number) => void;
}

interface Arc {
  to: number;
  cap: number;
  rev: number;
}

/** 4 邻域。 */
const NB: ReadonlyArray<[number, number]> = [
  [0, 1],
  [1, 0],
];

export function imageSegmentation(input: SegInput, hooks: SegHooks = {}): number[] {
  const { rows, cols, pixels } = input;
  const N = rows * cols;
  if (N === 0) {
    hooks.onDone?.([], 0, 0);
    return [];
  }
  const sigma = input.sigma ?? 30;
  const lambda = input.lambda ?? 1;
  const fgSeeds = new Set(input.fgSeeds ?? []);
  const bgSeeds = new Set(input.bgSeeds ?? []);

  const s = N;
  const t = N + 1;
  const n = N + 2;

  const g: Arc[][] = Array.from({ length: n }, () => []);
  let edgeCount = 0;

  const addEdge = (u: number, v: number, cap: number): void => {
    g[u]!.push({ to: v, cap, rev: g[v]!.length });
    g[v]!.push({ to: u, cap: 0, rev: g[u]!.length - 1 });
    edgeCount++;
  };

  // —— 邻域平滑边（n-link）：无向，两个方向都加 cap ——
  const smoothness = (a: number, b: number): number => {
    const d = Math.abs(pixels[a]! - pixels[b]!);
    return Math.exp(-(d * d) / (2 * sigma * sigma));
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = r * cols + c;
      for (const [dr, dc] of NB) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < rows && nc < cols) {
          const q = nr * cols + nc;
          const w = smoothness(p, q);
          // 无向：两个方向都有容量
          addEdge(p, q, w);
          addEdge(q, p, w);
        }
      }
    }
  }

  // —— 终端边（t-link）——
  // 用全局平均估计前景/背景颜色中心（若无种子，则用亮/暗启发式）
  const fgCenter = (() => {
    if (fgSeeds.size > 0) {
      let sum = 0;
      fgSeeds.forEach((i) => (sum += pixels[i]!));
      return sum / fgSeeds.size;
    }
    return 200; // 默认前景亮
  })();
  const bgCenter = (() => {
    if (bgSeeds.size > 0) {
      let sum = 0;
      bgSeeds.forEach((i) => (sum += pixels[i]!));
      return sum / bgSeeds.size;
    }
    return 60; // 默认背景暗
  })();

  for (let p = 0; p < N; p++) {
    const val = pixels[p]!;
    const df = Math.abs(val - fgCenter);
    const db = Math.abs(val - bgCenter);
    const fgWeight = lambda * Math.exp(-(df * df) / (2 * sigma * sigma));
    const bgWeight = lambda * Math.exp(-(db * db) / (2 * sigma * sigma));
    if (fgSeeds.has(p)) {
      // 硬约束：必前景 -> s→p 无穷，p→t 0
      addEdge(s, p, Infinity);
    } else {
      addEdge(s, p, bgWeight); // 被割开=p 归背景
    }
    if (bgSeeds.has(p)) {
      addEdge(p, t, Infinity); // 硬约束：必背景
    } else {
      addEdge(p, t, fgWeight); // 被割开=p 归前景（这里用对称定义）
    }
  }

  hooks.onBuildGraph?.(n, s, t, edgeCount);

  // —— Edmonds-Karp 最大流 ——
  let maxFlow = 0;
  const bfsAugment = (): number[] | null => {
    const parent = new Array<number>(n).fill(-1);
    const parentArcIdx = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[s] = true;
    const queue: number[] = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const arcs = g[u]!;
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]!;
        if (a.cap > 0 && !visited[a.to]) {
          visited[a.to] = true;
          parent[a.to] = u;
          parentArcIdx[a.to] = i;
          if (a.to === t) {
            // 回溯路径
            const path: number[] = [];
            let cur = t;
            let bottleneck = Infinity;
            while (cur !== s) {
              path.unshift(cur);
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              if (arc.cap < bottleneck) bottleneck = arc.cap;
              cur = p;
            }
            path.unshift(s);
            // 推进
            cur = t;
            while (cur !== s) {
              const p = parent[cur]!;
              const arc = g[p]![parentArcIdx[cur]!]!;
              arc.cap -= bottleneck;
              g[cur]![arc.rev]!.cap += bottleneck;
              cur = p;
            }
            maxFlow += bottleneck;
            return path;
          }
          queue.push(a.to);
        }
      }
    }
    return null;
  };

  while (bfsAugment() !== null) {
    // 持续增广
  }

  // —— 从 s 出发 BFS，可达 = 前景 ——
  const labels = new Array<number>(N).fill(0);
  const visited = new Array<boolean>(n).fill(false);
  visited[s] = true;
  const queue: number[] = [s];
  let head = 0;
  const foreground: number[] = [];
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    if (u < N) {
      labels[u] = 1;
      foreground.push(u);
    }
    const arcs = g[u]!;
    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i]!;
      if (a.cap > 0 && !visited[a.to]) {
        visited[a.to] = true;
        queue.push(a.to);
      }
    }
  }

  hooks.onCut?.(maxFlow, [...foreground]);
  hooks.onDone?.(labels, foreground.length, N - foreground.length);
  return labels;
}
