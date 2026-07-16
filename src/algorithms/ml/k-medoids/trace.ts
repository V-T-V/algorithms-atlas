// =============================================================================
// K-Medoids 聚类 · 录制帧序列
// 用 setGraph 展示：数据点按簇着色，medoid 用 frontier 角色突出。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kMedoids, mulberry32, type KMedoidsHooks, type Point } from './impl.ts';

export interface KMedoidsInput {
  points: Point[];
  k: number;
  seed?: number;
}

export const DEFAULT_INPUT: KMedoidsInput = {
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

const CLUSTER_ROLES: BarRole[] = ['default', 'compare', 'swap', 'pivot'];

/** 把所有点映射到 [0,1]×[0,1] 归一化坐标。 */
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
    y: 1 - (padding + ((p.y - minY) / spanY) * (1 - 2 * padding)),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: KMedoidsInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, k, seed = 42 } = input;
  const n = points.length;
  const norm = normalize(points);

  const render = (
    assignments: number[],
    medoidIndices: number[],
    note: { zh: string; en: string },
    options: { medoidRole?: BarRole; activePoint?: number } = {},
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
    medoidIndices.forEach((mi, ci) => {
      const np = norm(points[mi]!);
      // medoid 节点覆盖同名 p 节点：用独立 id
      nodes.push({
        id: `m${ci}`,
        label: `M${ci}`,
        x: np.x,
        y: np.y,
        role: options.medoidRole ?? 'frontier',
      });
    });
    const edges: GraphEdge[] = points.map((_, i) => ({
      from: `p${i}`,
      to: `m${assignments[i]! >= 0 ? assignments[i]! : 0}`,
      role: 'default' as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  // 预演初始化 medoid 索引
  const rng = mulberry32(seed);
  const pool = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(rng() * (n - i));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  const initMedoids = pool.slice(0, k);
  const initAssign = new Array<number>(n).fill(-1);
  render(initAssign, initMedoids, {
    zh: `初始化 ${k} 个 medoid（种子 ${seed}）`,
    en: `Init ${k} medoids (seed ${seed})`,
  });

  let curAssign = [...initAssign];
  let curMedoids = [...initMedoids];

  const hooks: KMedoidsHooks = {
    onIteration: (iter, medoidIndices) => {
      curMedoids = [...medoidIndices];
      render(curAssign, curMedoids, {
        zh: `第 ${iter + 1} 轮迭代（尝试交换 medoid）`,
        en: `Iteration ${iter + 1} (try swapping medoids)`,
      });
    },
    onAssign: (_i, _k2, assignments) => {
      curAssign = [...assignments];
    },
    onSwapTry: (m, o, oldCost, newCost, accepted) => {
      if (accepted) {
        render(curAssign, curMedoids, {
          zh: `交换 medoid：用 P${o} 替换 P${m}（代价 ${oldCost.toFixed(2)} → ${newCost.toFixed(2)}）`,
          en: `Swap medoid: P${o} replaces P${m} (cost ${oldCost.toFixed(2)} → ${newCost.toFixed(2)})`,
        });
      }
    },
  };

  const result = kMedoids(points, { k, seed, maxIterations: 50 }, hooks);

  render(
    result.assignments,
    result.medoidIndices,
    {
      zh: `收敛：${result.iterations} 轮，总代价 ${result.cost.toFixed(2)}`,
      en: `Converged in ${result.iterations} iterations, cost ${result.cost.toFixed(2)}`,
    },
    { medoidRole: 'final' },
  );

  return rec.build();
}
