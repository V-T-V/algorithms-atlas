// =============================================================================
// 判定二分图 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isBipartite, type IsBipartiteHooks } from './impl.ts';

export const DEFAULT_GRAPH = [
  [1, 3],
  [0, 2],
  [1, 3],
  [0, 2],
];

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.25, y: 0.3 },
  1: { x: 0.75, y: 0.3 },
  2: { x: 0.75, y: 0.75 },
  3: { x: 0.25, y: 0.75 },
};

export function buildTrace(graph: number[][] = DEFAULT_GRAPH): Frame[] {
  const rec = new TraceRecorder();
  const n = graph.length;
  const color: number[] = new Array<number>(n).fill(-1);
  let conflictPair: [number, number] | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = graph.map((_, i) => {
      let role: BarRole = 'default';
      if (conflictPair && (i === conflictPair[0] || i === conflictPair[1])) role = 'warn';
      else if (color[i]! === 0) role = 'frontier';
      else if (color[i]! === 1) role = 'swap';
      const p = POS[i] ?? { x: 0.5, y: 0.5 };
      return { id: `${i}`, label: `${i}:${color[i]! < 0 ? '?' : color[i]}`, x: p.x, y: p.y, role };
    });
    const edges: GraphEdge[] = [];
    for (let u = 0; u < n; u++) {
      for (const v of graph[u]!) {
        if (u < v) edges.push({ from: `${u}`, to: `${v}` });
      }
    }
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: `${n} 节点二分判定`, en: `${n}-node bipartite check` });

  const wrappedHooks: IsBipartiteHooks = {
    onColor: (node, c) => {
      color[node] = c;
      render({ zh: `染 ${node}=${c}`, en: `Color ${node}=${c}` });
    },
    onConflict: (a, b) => {
      conflictPair = [a, b];
      render({ zh: `冲突 ${a}-${b} 同色`, en: `Conflict ${a}-${b}` });
    },
    onResult: (ok) =>
      render({ zh: ok ? '是二分图' : '非二分图', en: ok ? 'Bipartite' : 'Not bipartite' }),
  };

  const result = isBipartite(graph, wrappedHooks);

  conflictPair = null;
  rec
    .begin({ zh: result ? '是二分图' : '非二分图', en: result ? 'Bipartite' : 'Not bipartite' })
    .setGraph(
      graph.map((_, i) => {
        const role: BarRole = 'final';
        const p = POS[i] ?? { x: 0.5, y: 0.5 };
        return { id: `${i}`, label: `${i}`, x: p.x, y: p.y, role };
      }),
      graph.flatMap((nbrs, u) =>
        nbrs.filter((v) => u < v).map((v) => ({ from: `${u}`, to: `${v}` })),
      ),
    )
    .setAux([{ label: '结果', value: result ? 'true' : 'false', role: 'final' }])
    .commit();

  return rec.build();
}
