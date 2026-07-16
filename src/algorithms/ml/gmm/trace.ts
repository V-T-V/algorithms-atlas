// =============================================================================
// 高斯混合模型（EM）· 录制帧序列
// 用 setGraph 展示：数据点按硬分配着色，分量均值用 frontier 标记。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gmm, type Component, type GMMHooks, type Point } from './impl.ts';

export interface GMMInput {
  points: Point[];
  k: number;
  seed?: number;
}

export const DEFAULT_INPUT: GMMInput = {
  points: [
    { x: 1, y: 1 },
    { x: 1.4, y: 1.2 },
    { x: 0.8, y: 1.6 },
    { x: 8, y: 8 },
    { x: 8.4, y: 7.8 },
    { x: 7.7, y: 8.3 },
    { x: 4, y: 5 },
    { x: 4.5, y: 5.2 },
    { x: 3.8, y: 4.7 },
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
export function buildTrace(input: GMMInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, k, seed = 42 } = input;
  const norm = normalize(points);

  const render = (
    assignments: number[],
    components: Component[],
    note: { zh: string; en: string },
    options: { meanRole?: BarRole } = {},
  ): void => {
    const nodes: GraphNode[] = points.map((p, i) => {
      const np = norm(p);
      const cluster = assignments[i]! < 0 ? 0 : assignments[i]!;
      return {
        id: `p${i}`,
        label: `P${i}`,
        x: np.x,
        y: np.y,
        role: CLUSTER_ROLES[cluster % CLUSTER_ROLES.length]!,
      };
    });
    components.forEach((c, ci) => {
      const nm = norm(c.mean);
      nodes.push({
        id: `mu${ci}`,
        label: `μ${ci}`,
        x: nm.x,
        y: nm.y,
        role: options.meanRole ?? 'frontier',
      });
    });
    const edges: GraphEdge[] = points.map((_, i) => ({
      from: `p${i}`,
      to: `mu${assignments[i]! >= 0 ? assignments[i]! : 0}`,
      role: 'default' as BarRole,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  // 初始帧（E 步前），均值为初始化
  const initAssign = new Array<number>(points.length).fill(-1);
  render(initAssign, [], {
    zh: `初始化：${k} 个高斯分量（种子 ${seed}）`,
    en: `Init ${k} Gaussian components (seed ${seed})`,
  });

  let curComponents: Component[] = [];
  let curResp: number[][] = [];

  const hooks: GMMHooks = {
    onEStep: (_iter, resp) => {
      curResp = resp.map((r) => [...r]);
    },
    onMStep: (_iter, comps) => {
      curComponents = comps.map((c) => ({
        ...c,
        mean: { ...c.mean },
        variance: { ...c.variance },
      }));
    },
    onIteration: (iter, comps, ll) => {
      curComponents = comps.map((c) => ({
        ...c,
        mean: { ...c.mean },
        variance: { ...c.variance },
      }));
      const hardAssign = curResp.map((r) => {
        let best = 0;
        for (let c = 0; c < k; c++) if ((r![c] ?? 0) > (r![best] ?? 0)) best = c;
        return best;
      });
      render(hardAssign, curComponents, {
        zh: `第 ${iter + 1} 轮 EM：log-likelihood = ${ll.toFixed(2)}`,
        en: `EM round ${iter + 1}: log-likelihood = ${ll.toFixed(2)}`,
      });
    },
  };

  const result = gmm(points, { k, seed, maxIterations: 50 }, hooks);

  const hardAssign = result.assignments;
  render(
    hardAssign,
    result.components,
    {
      zh: `收敛：${result.iterations} 轮，LL = ${result.logLikelihood.toFixed(2)}`,
      en: `Converged in ${result.iterations} rounds, LL = ${result.logLikelihood.toFixed(2)}`,
    },
    { meanRole: 'final' },
  );

  return rec.build();
}
