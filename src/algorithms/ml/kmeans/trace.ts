// =============================================================================
// K-均值聚类 · 录制帧序列
// 用 setGraph 展示：数据点按簇着色，质心用 frontier 角色突出。
// =============================================================================

import type { BarRole, Frame, GraphNode, GraphEdge } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kmeans, mulberry32, type KMeansHooks, type Point } from './impl.ts';

export interface KMeansInput {
  points: Point[];
  k: number;
  /** 复现种子。 */
  seed?: number;
}

export const DEFAULT_INPUT: KMeansInput = {
  points: [
    { x: 1, y: 1 },
    { x: 1.5, y: 2 },
    { x: 2, y: 1 },
    { x: 8, y: 8 },
    { x: 9, y: 8.5 },
    { x: 8.5, y: 9 },
    { x: 4, y: 6 },
    { x: 5, y: 6 },
    { x: 4.5, y: 5.5 },
  ],
  k: 3,
  seed: 42,
};

/** 各簇角色轮换（区分不同簇的颜色语义）。 */
const CLUSTER_ROLES: BarRole[] = ['default', 'compare', 'swap', 'pivot'];

/** 把所有点+质心映射到 [0,1]×[0,1] 归一化坐标（带 padding）。 */
function normalize(all: Point[], padding = 0.08): (p: Point) => { x: number; y: number } {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of all) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return (p: Point) => ({
    x: padding + ((p.x - minX) / spanX) * (1 - 2 * padding),
    // y 翻转：数学坐标向上 → 屏幕向上
    y: 1 - (padding + ((p.y - minY) / spanY) * (1 - 2 * padding)),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: KMeansInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, k, seed = 42 } = input;
  const n = points.length;

  // 收集所有曾出现过的坐标，用于归一化基准
  const norm = normalize(points);

  const render = (
    assignments: number[],
    centroids: Point[],
    note: { zh: string; en: string },
    options: { centroidRole?: BarRole; activePoint?: number } = {},
  ): void => {
    const nodes: GraphNode[] = points.map((p, i) => {
      const np = norm(p);
      const cluster = assignments[i]! < 0 ? 0 : assignments[i]!;
      return {
        id: `p${i}`,
        label: `P${i}`,
        x: np.x,
        y: np.y,
        role:
          i === options.activePoint ? 'compare' : CLUSTER_ROLES[cluster % CLUSTER_ROLES.length]!,
      };
    });
    centroids.forEach((c, ci) => {
      const nc = norm(c);
      nodes.push({
        id: `c${ci}`,
        label: `C${ci}`,
        x: nc.x,
        y: nc.y,
        role: options.centroidRole ?? 'frontier',
      });
    });
    // 边：每个点连到其质心
    const edges: GraphEdge[] = points.map((_, i) => ({
      from: `p${i}`,
      to: `c${assignments[i]! >= 0 ? assignments[i]! : 0}`,
      role: 'default' as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  // 初始帧（用 rng 预演初始化质心位置以展示）
  const rng = mulberry32(seed);
  const initIdx: number[] = [];
  const pool = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (n - i));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
    initIdx.push(pool[i]!);
  }
  const initCentroids = initIdx.map((idx) => ({ ...points[idx]! }));
  const initAssign = new Array<number>(n).fill(-1);
  render(initAssign, initCentroids, {
    zh: `初始化 ${k} 个质心（种子 ${seed}）`,
    en: `Init ${k} centroids (seed ${seed})`,
  });

  let curAssign = [...initAssign];
  let curCentroids = initCentroids.map((c) => ({ ...c }));

  const hooks: KMeansHooks = {
    onIteration: (iter, centroids) => {
      curCentroids = centroids.map((c) => ({ ...c }));
      render(curAssign, curCentroids, {
        zh: `第 ${iter + 1} 轮迭代`,
        en: `Iteration ${iter + 1}`,
      });
    },
    onAssign: (i, k2, assignments) => {
      curAssign = [...assignments];
      render(
        curAssign,
        curCentroids,
        {
          zh: `点 P${i} → 簇 ${k2}`,
          en: `Assign P${i} -> cluster ${k2}`,
        },
        { activePoint: i },
      );
    },
    onUpdateCentroid: (ci, centroid, centroids) => {
      curCentroids = centroids.map((c) => ({ ...c }));
      curCentroids[ci] = { ...centroid };
      render(
        curAssign,
        curCentroids,
        {
          zh: `更新质心 C${ci} = (${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})`,
          en: `Update centroid C${ci} = (${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)})`,
        },
        { centroidRole: 'warn' },
      );
    },
  };

  const result = kmeans(points, { k, seed, maxIterations: 50 }, hooks);

  // 终态
  render(
    result.assignments,
    result.centroids,
    {
      zh: `收敛：${result.iterations} 轮，${result.assignments.length} 个点已归类`,
      en: `Converged in ${result.iterations} iterations`,
    },
    { centroidRole: 'final' },
  );

  return rec.build();
}
