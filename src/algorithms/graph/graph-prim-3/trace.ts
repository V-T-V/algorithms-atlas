// =============================================================================
// Prim · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { prim, type PrimGraphInput, type PrimHooks } from './impl.ts';

export const DEFAULT_INPUT: PrimGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 3 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 4 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 6 },
    { from: 'D', to: 'E', weight: 7 },
  ],
};

export const DEFAULT_START = 'A';

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.15, y: 0.5 },
  B: { x: 0.4, y: 0.2 },
  C: { x: 0.4, y: 0.8 },
  D: { x: 0.7, y: 0.3 },
  E: { x: 0.9, y: 0.7 },
};

export function buildTrace(input: PrimGraphInput = DEFAULT_INPUT, start = DEFAULT_START): Frame[] {
  const rec = new TraceRecorder();
  const inTree = new Set<string>();
  const treeEdgeSet = new Set<string>();
  let active: string | null = null;

  const key = (a: string, b: string): string => (a < b ? `${a}-${b}` : `${b}-${a}`);

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (inTree.has(id) ? 'final' : id === active ? 'compare' : 'default') as BarRole,
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          weight: e.weight,
          role: (treeEdgeSet.has(key(e.from, e.to))
            ? 'final'
            : e.from === active || e.to === active
              ? 'compare'
              : 'default') as BarRole,
        })),
      )
      .setAux([{ label: 'Tree size', value: String(inTree.size), role: 'frontier' }])
      .commit();
  };

  render({ zh: `Prim 从 ${start} 开始`, en: `Prim from ${start}` });

  const hooks: PrimHooks = {
    onPick: (u) => {
      inTree.add(u);
      active = u;
      render({ zh: `纳入 ${u}`, en: `Add ${u}` });
    },
    onTreeEdge: (u, v) => {
      treeEdgeSet.add(key(u, v));
      render({ zh: `加入树边 ${u}-${v}`, en: `Tree edge ${u}-${v}` });
    },
  };

  const r = prim(input, start, hooks);

  rec
    .begin({ zh: `Prim 完成 总权=${r.totalWeight}`, en: `Prim done total=${r.totalWeight}` })
    .setAux([{ label: 'MST 权重', value: String(r.totalWeight), role: 'final' }])
    .commit();

  return rec.build();
}
