// 中国邮路 · 录制帧序列

import type { Frame, GraphNode, GraphEdge } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chineseStamp, type Edge, type ChinesePostmanHooks } from './impl.ts';

/** 默认演示：一个 4 顶点的小图。 */
export const DEFAULT_INPUT: { V: number; edges: Edge[] } = {
  V: 4,
  edges: [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 2, v: 3, w: 1 },
    { u: 3, v: 0, w: 2 },
    { u: 0, v: 2, w: 4 },
  ],
};

// 正方形 4 角坐标（用于布局）
const POS: Array<[number, number]> = [
  [0.2, 0.3],
  [0.8, 0.3],
  [0.8, 0.8],
  [0.2, 0.8],
];

function buildGraph(
  V: number,
  edges: readonly Edge[],
  highlightEdges: Array<[number, number]> = [],
  oddVertices: number[] = [],
  roles: Record<number, 'default' | 'pivot' | 'swap' | 'final'> = {},
): { nodes: GraphNode[]; edgeList: GraphEdge[] } {
  const nodes: GraphNode[] = Array.from({ length: V }, (_, i) => ({
    id: String(i),
    label: String(i),
    x: POS[i % POS.length]![0],
    y: POS[i % POS.length]![1],
    role: (roles[i] ?? (oddVertices.includes(i) ? 'pivot' : 'default')) as GraphNode['role'],
  }));
  const edgeList: GraphEdge[] = edges.map((e) => {
    const hl = highlightEdges.some(
      ([a, b]) => (a === e.u && b === e.v) || (a === e.v && b === e.u),
    );
    return {
      from: String(e.u),
      to: String(e.v),
      weight: e.w,
      role: hl ? 'swap' : 'default',
    } as GraphEdge;
  });
  return { nodes, edgeList };
}

/** 录制演示帧序列。 */
export function buildTrace(input: { V: number; edges: Edge[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { V, edges } = input;

  const init = buildGraph(V, edges);
  rec
    .begin({
      zh: `带权无向图（${V} 点 ${edges.length} 边）`,
      en: `Weighted undirected graph (${V}v ${edges.length}e)`,
    })
    .setGraph(init.nodes, init.edgeList)
    .commit();

  let oddVertices: number[] = [];
  let matchedPairs: Array<[number, number]> = [];
  let finalTour: number[] = [];

  const hooks: ChinesePostmanHooks = {
    onOddVertices: (odds) => {
      oddVertices = odds;
      const g = buildGraph(V, edges, [], odds);
      rec
        .begin({
          zh: `奇度点：${odds.length === 0 ? '无（已是欧拉图）' : odds.join(', ')}`,
          en: `Odd-degree vertices: ${odds.length === 0 ? 'none (already Eulerian)' : odds.join(', ')}`,
        })
        .setGraph(g.nodes, g.edgeList)
        .commit();
    },
    onMatching: (pairs, cost) => {
      matchedPairs = pairs;
      const g = buildGraph(V, edges, pairs, oddVertices);
      rec
        .begin({
          zh: `最小权匹配：${pairs.map((p) => p.join('-')).join('  ')}（额外代价 ${cost}）`,
          en: `Min-weight matching: ${pairs.map((p) => p.join('-')).join('  ')} (cost ${cost})`,
        })
        .setGraph(g.nodes, g.edgeList)
        .commit();
    },
    onEulerTour: (tour) => {
      finalTour = tour;
      rec
        .begin({
          zh: `欧拉回路：${tour.join(' → ')}`,
          en: `Euler tour: ${tour.join(' → ')}`,
        })
        .setGraph(init.nodes, init.edgeList)
        .commit();
    },
    onDone: (result) => {
      void finalTour;
      const roles: Record<number, 'final'> = {};
      for (let i = 0; i < V; i++) roles[i] = 'final';
      const g = buildGraph(V, edges, matchedPairs, oddVertices, roles);
      rec
        .begin({
          zh: `完成：最短闭合邮路长度 = ${result.routeLength}（原图 ${result.totalWeight} + 重复 ${result.addedWeight}）`,
          en: `Done: optimal route = ${result.routeLength} (base ${result.totalWeight} + duplicate ${result.addedWeight})`,
        })
        .setGraph(g.nodes, g.edgeList)
        .commit();
    },
  };

  chineseStamp(V, edges, hooks);

  return rec.build();
}
