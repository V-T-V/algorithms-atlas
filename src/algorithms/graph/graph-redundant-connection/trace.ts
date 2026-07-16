// =============================================================================
// 冗余连接 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findRedundantConnection, type RedundantConnectionHooks } from './impl.ts';

export const DEFAULT_EDGES: Array<[number, number]> = [
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 4],
  [1, 5],
];

const POS: Record<number, { x: number; y: number }> = {
  1: { x: 0.3, y: 0.3 },
  2: { x: 0.7, y: 0.3 },
  3: { x: 0.7, y: 0.75 },
  4: { x: 0.3, y: 0.75 },
  5: { x: 0.1, y: 0.5 },
};

export function buildTrace(edges: ReadonlyArray<[number, number]> = DEFAULT_EDGES): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = new Set<number>();
  edges.forEach(([a, b]) => {
    nodeIds.add(a);
    nodeIds.add(b);
  });
  const addedEdges = new Set<string>();
  let redundant: [number, number] | null = null;
  let curEdge: [number, number] | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [...nodeIds]
      .sort((a, b) => a - b)
      .map((i) => {
        let role: BarRole = 'default';
        if (curEdge && (i === curEdge[0] || i === curEdge[1])) role = 'compare';
        const p = POS[i] ?? { x: 0.5, y: 0.5 };
        return { id: `${i}`, label: `${i}`, x: p.x, y: p.y, role };
      });
    const e: GraphEdge[] = edges.map(([a, b]) => {
      let role: BarRole = 'default';
      const key = `${a}-${b}`;
      if (redundant && redundant[0] === a && redundant[1] === b) role = 'warn';
      else if (addedEdges.has(key)) role = 'frontier';
      return { from: `${a}`, to: `${b}`, role };
    });
    rec.begin(note).setGraph(nodes, e).commit();
  };

  render({ zh: `${edges.length} 条边`, en: `${edges.length} edges` });

  const hooks: RedundantConnectionHooks = {
    onUnion: (a, b) => {
      addedEdges.add(`${a}-${b}`);
      curEdge = [a, b];
      render({ zh: `合并 ${a}-${b}`, en: `Union ${a}-${b}` });
    },
    onCycle: (a, b) => {
      redundant = [a, b];
      curEdge = [a, b];
      render({ zh: `检测到环：${a}-${b}`, en: `Cycle detected: ${a}-${b}` });
    },
    onResult: () => render({ zh: '完成', en: 'Done' }),
  };

  const result = findRedundantConnection(edges, hooks);

  curEdge = null;
  rec
    .begin({ zh: `冗余边 = [${result.join(',')}]`, en: `Redundant = [${result.join(',')}]` })
    .setGraph(
      [...nodeIds]
        .sort((a, b) => a - b)
        .map((i) => {
          const p = POS[i] ?? { x: 0.5, y: 0.5 };
          return { id: `${i}`, label: `${i}`, x: p.x, y: p.y, role: 'final' as BarRole };
        }),
      edges.map(([a, b]) => ({
        from: `${a}`,
        to: `${b}`,
        role: (result[0] === a && result[1] === b ? 'warn' : 'final') as BarRole,
      })),
    )
    .setAux([{ label: '冗余边', value: `[${result.join(',')}]`, role: 'warn' }])
    .commit();

  return rec.build();
}
