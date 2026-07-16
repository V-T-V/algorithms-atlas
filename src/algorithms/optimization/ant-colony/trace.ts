// =============================================================================
// 蚁群算法 · 录制帧序列
// 可视化：setGraph 渲染 TSP 城市（归一化坐标）+ 边（最优回路='final'，当前信息素浓='pivot'）；
// setAux 展示迭代/当前最优长度/全局最优长度。固定种子可复现。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  antColony,
  dist,
  mulberry32,
  type ACOOptions,
  type AntColonyHooks,
  type City,
} from './impl.ts';

export interface ACOInput {
  cities: City[];
  seed?: number;
}

/** 一个小型 TSP 实例：6 个城市，归一化坐标（0~1）便于渲染。 */
export const DEFAULT_INPUT: ACOInput = {
  cities: [
    { x: 0.1, y: 0.2 },
    { x: 0.85, y: 0.15 },
    { x: 0.8, y: 0.8 },
    { x: 0.2, y: 0.85 },
    { x: 0.5, y: 0.5 },
    { x: 0.95, y: 0.5 },
  ],
  seed: 42,
};

/** 录制演示帧序列。 */
export function buildTrace(input: ACOInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { cities, seed = 42 } = input;
  const n = cities.length;

  const nodes: GraphNode[] = cities.map((c, i) => ({
    id: String(i),
    label: String(i),
    x: c.x,
    y: c.y,
    role: 'default',
  }));

  let globalBest = Infinity;
  let bestTour: number[] = [];

  const snapshot = (
    note: { zh: string; en: string },
    iter: number,
    iterBest: number,
    tour: number[],
  ): void => {
    // 把当前最优回路画成边（final）；起点节点高亮（pivot）
    const edges: GraphEdge[] = [];
    if (tour.length === n) {
      for (let i = 0; i < n; i++) {
        const a = tour[i]!;
        const b = tour[(i + 1) % n]!;
        edges.push({
          from: String(a),
          to: String(b),
          weight: Number(dist(cities[a]!, cities[b]!).toFixed(3)),
          role: 'final',
        });
      }
    }
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'default' as BarRole },
        {
          label: '本代最优',
          value: isFinite(iterBest) ? iterBest.toFixed(3) : '—',
          role: 'compare' as BarRole,
        },
        {
          label: '全局最优',
          value: isFinite(globalBest) ? globalBest.toFixed(3) : '—',
          role: 'final' as BarRole,
        },
        {
          label: '最优回路',
          value: tour.length === n ? tour.map((t) => t).join('→') + `→${tour[0]}` : '—',
          role: 'pivot' as BarRole,
        },
      ])
      .commit();
  };

  // 初始
  rec
    .begin({
      zh: `${n} 个城市的 TSP：蚂蚁按信息素 τ 与能见度 η 概率选路`,
      en: `TSP on ${n} cities: ants pick edges by probability ∝ τ^α · η^β`,
    })
    .setGraph(nodes, [])
    .setAux([
      { label: '城市数', value: String(n), role: 'default' as BarRole },
      { label: '状态', value: '初始化信息素', role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: AntColonyHooks = {
    onIteration: (iter, iterBest, gb, bt) => {
      if (gb < globalBest) {
        globalBest = gb;
        bestTour = [...bt];
      }
      snapshot(
        {
          zh: `第 ${iter + 1} 代：本代最优 ${iterBest.toFixed(3)}，全局最优 ${globalBest.toFixed(3)}`,
          en: `Gen ${iter + 1}: gen-best ${iterBest.toFixed(3)}, global-best ${globalBest.toFixed(3)}`,
        },
        iter,
        iterBest,
        bestTour,
      );
    },
  };

  const options: ACOOptions = {
    antCount: 8,
    iterations: 30,
    alpha: 1,
    beta: 3,
    rho: 0.1,
    Q: 100,
    initialPheromone: 1,
    rng: mulberry32(seed),
  };

  const result = antColony(cities, options, hooks);

  // 终态：高亮最优回路
  const finalEdges: GraphEdge[] = [];
  for (let i = 0; i < n; i++) {
    const a = result.bestTour[i]!;
    const b = result.bestTour[(i + 1) % n]!;
    finalEdges.push({
      from: String(a),
      to: String(b),
      weight: Number(dist(cities[a]!, cities[b]!).toFixed(3)),
      role: 'final',
    });
  }
  const finalNodes: GraphNode[] = nodes.map((nd, i) => ({
    ...nd,
    role: (i === result.bestTour[0] ? 'pivot' : 'final') as BarRole,
  }));
  rec
    .begin({
      zh: `完成：最优回路长度 ${result.bestLength.toFixed(3)}`,
      en: `Done: best tour length ${result.bestLength.toFixed(3)}`,
    })
    .setGraph(finalNodes, finalEdges)
    .setAux([
      { label: '最优长度', value: result.bestLength.toFixed(3), role: 'final' as BarRole },
      {
        label: '最优回路',
        value: result.bestTour.join('→') + `→${result.bestTour[0]}`,
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
