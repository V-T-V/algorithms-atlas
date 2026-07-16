// =============================================================================
// 可达节点 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reachableNodes, type ReachableNodesHooks } from './impl.ts';

export const DEFAULT_EDGES: Array<[number, number, number]> = [
  [0, 1, 10],
  [0, 2, 1],
  [1, 2, 2],
];
export const DEFAULT_MAX_MOVES = 6;
export const DEFAULT_N = 3;

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.2, y: 0.5 },
  1: { x: 0.8, y: 0.5 },
  2: { x: 0.5, y: 0.2 },
};

export function buildTrace(
  edges: ReadonlyArray<[number, number, number]> = DEFAULT_EDGES,
  maxMoves: number = DEFAULT_MAX_MOVES,
  n: number = DEFAULT_N,
): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<number, number>();
  for (let i = 0; i < n; i++) dist.set(i, Infinity);
  dist.set(0, 0);
  const settled = new Set<number>();
  let ans = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
      let role: BarRole = 'default';
      if (settled.has(i)) role = 'final';
      const p = POS[i] ?? { x: 0.5, y: 0.5 };
      const d = dist.get(i) ?? Infinity;
      return { id: `${i}`, label: `${i}(${d === Infinity ? '∞' : d})`, x: p.x, y: p.y, role };
    });
    const e: GraphEdge[] = edges.map(([u, v, c]) => ({
      from: `${u}`,
      to: `${v}`,
      weight: c,
      role: (settled.has(u) && settled.has(v) ? 'final' : 'default') as BarRole,
    }));
    rec
      .begin(note)
      .setGraph(nodes, e)
      .setAux([{ label: 'maxMoves', value: String(maxMoves), role: 'pivot' }])
      .commit();
  };

  render({ zh: `${n} 节点，maxMoves=${maxMoves}`, en: `${n} nodes, maxMoves=${maxMoves}` });

  const hooks: ReachableNodesHooks = {
    onSettle: (u, d) => {
      settled.add(u);
      render({ zh: `确定 ${u}（dist=${d}）`, en: `Settle ${u} (dist=${d})` });
    },
    onResult: (cnt) => {
      ans = cnt;
      render({ zh: `可达节点 = ${cnt}`, en: `Reachable = ${cnt}` });
    },
  };

  const result = reachableNodes(edges, maxMoves, n, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setAux([{ label: '可达 / reachable', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
