// =============================================================================
// Dijkstra·二叉堆优化 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstraHeap, type GraphInput, type DijkstraHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 1 },
    { from: 'S', to: 'B', weight: 5 },
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'D', to: 'T', weight: 2 },
    { from: 'C', to: 'T', weight: 7 },
  ],
  source: 'S',
};

const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.05, y: 0.5 },
  A: { x: 0.25, y: 0.2 },
  B: { x: 0.25, y: 0.8 },
  C: { x: 0.5, y: 0.5 },
  D: { x: 0.75, y: 0.8 },
  T: { x: 0.95, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dist = new Map<string, number>();
  for (const n of nodeIds) dist.set(n, Infinity);
  dist.set(input.source ?? nodeIds[0] ?? '', 0);
  const settled = new Set<string>();
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;

  const fmt = (id: string): string => {
    const v = dist.get(id);
    return v === undefined || v === Infinity ? '∞' : String(v);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (settled.has(id)) role = 'final';
      if (id === cur) role = 'compare';
      else if (dist.get(id) !== Infinity && !settled.has(id)) role = 'frontier';
      return {
        id,
        label: `${id}\nd=${fmt(id)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      else if (settled.has(e.from) && settled.has(e.to)) role = 'final';
      return { from: e.from, to: e.to, weight: e.weight, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dist', value: nodeIds.map((n) => `${n}:${fmt(n)}`).join('  ') },
        { label: '已确定', value: settled.size ? [...settled].join(', ') : '∅', role: 'final' },
      ])
      .commit();
  };

  render({
    zh: `源点 ${input.source ?? ''}，dist 初始化`,
    en: `Source ${input.source ?? ''}, init dist`,
  });

  const hooks: DijkstraHooks = {
    onSettle: (v, d) => {
      settled.add(v);
      dist.set(v, d);
      cur = v;
      render({ zh: `取出 ${v}（d=${d}）确定`, en: `Pop & settle ${v} (d=${d})` });
    },
    onRelax: (u, v, nd) => {
      dist.set(v, nd);
      examEdge = { from: u, to: v };
      cur = u;
      render({ zh: `松弛 ${u}→${v}：d=${nd}`, en: `Relax ${u}→${v}: d=${nd}` });
      examEdge = null;
    },
    onResult: () => {
      cur = null;
    },
  };

  dijkstraHeap(input, hooks);

  cur = null;
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: `${id}\nd=${fmt(id)}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        directed: true,
        role: 'default' as BarRole,
      })),
    )
    .setAux([
      { label: 'dist', value: nodeIds.map((n) => `${n}:${fmt(n)}`).join('  '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
