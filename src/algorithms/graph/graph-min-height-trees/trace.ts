// =============================================================================
// 最小高度树 · 录制帧序列
import type { BarRole, GraphEdge, GraphNode, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinHeightTrees, type MinHeightTreesHooks } from './impl.ts';

export const DEFAULT_N = 6;
export const DEFAULT_EDGES: Array<[number, number]> = [
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 4],
  [5, 4],
];

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.2, y: 0.2 },
  1: { x: 0.5, y: 0.2 },
  2: { x: 0.8, y: 0.2 },
  3: { x: 0.5, y: 0.5 },
  4: { x: 0.5, y: 0.78 },
  5: { x: 0.8, y: 0.92 },
};

export function buildTrace(
  n: number = DEFAULT_N,
  edges: ReadonlyArray<[number, number]> = DEFAULT_EDGES,
): Frame[] {
  const rec = new TraceRecorder();
  const removed = new Set<number>();
  let result: number[] = [];

  const render = (note: { zh: string; en: string }, peeling: number[] = []): void => {
    const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
      let role: BarRole = 'default';
      if (removed.has(i)) role = 'warn';
      else if (result.includes(i)) role = 'final';
      else if (peeling.includes(i)) role = 'compare';
      const p = POS[i] ?? { x: 0.5, y: 0.5 };
      return { id: `${i}`, label: `${i}`, x: p.x, y: p.y, role };
    });
    const e: GraphEdge[] = edges
      .filter(([a, b]) => !removed.has(a) && !removed.has(b))
      .map(([a, b]) => ({ from: `${a}`, to: `${b}`, role: 'default' as BarRole }));
    rec.begin(note).setGraph(nodes, e).commit();
  };

  render({ zh: `${n} 节点树`, en: `${n}-node tree` });

  const hooks: MinHeightTreesHooks = {
    onPeel: (_r, leaves) => {
      leaves.forEach((l) => removed.add(l));
      render(
        { zh: `剥叶子：${leaves.join(', ')}`, en: `Peel leaves: ${leaves.join(', ')}` },
        leaves,
      );
    },
    onResult: (roots) => {
      result = roots;
      render({ zh: `中心 = ${roots.join(', ')}`, en: `Centers = ${roots.join(', ')}` });
    },
  };

  const res = findMinHeightTrees(n, edges, hooks);
  result = res;
  removed.clear();

  rec
    .begin({ zh: `中心：${res.join(', ')}`, en: `Centers: ${res.join(', ')}` })
    .setGraph(
      Array.from({ length: n }, (_, i) => {
        const p = POS[i] ?? { x: 0.5, y: 0.5 };
        return {
          id: `${i}`,
          label: `${i}`,
          x: p.x,
          y: p.y,
          role: (res.includes(i) ? 'final' : 'default') as BarRole,
        };
      }),
      edges.map(([a, b]) => ({
        from: `${a}`,
        to: `${b}`,
        role: (res.includes(a) && res.includes(b) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: '根 / roots', value: res.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
