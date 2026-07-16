// =============================================================================
// 可撤销 Kruskal · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kruskalRollback, type GraphInput, type RollbackDsuHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1', weight: 4 },
    { from: '0', to: '2', weight: 1 },
    { from: '1', to: '2', weight: 3 },
    { from: '1', to: '3', weight: 2 },
    { from: '2', to: '3', weight: 5 },
    { from: '3', to: '4', weight: 6 },
    { from: '2', to: '4', weight: 7 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '0': { x: 0.15, y: 0.2 },
  '1': { x: 0.15, y: 0.8 },
  '2': { x: 0.5, y: 0.5 },
  '3': { x: 0.85, y: 0.8 },
  '4': { x: 0.85, y: 0.2 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const inMst = new Set<string>();
  let total = 0;
  let examEdge: { from: string; to: string } | null = null;
  let rollbackHappened = false;

  const edgeKey = (a: string, b: string): string => [a, b].sort().join('-');

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: 'default' as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (inMst.has(edgeKey(e.from, e.to))) role = 'final';
      if (examEdge && edgeKey(examEdge.from, examEdge.to) === edgeKey(e.from, e.to))
        role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'MST 权重', value: String(total), role: 'final' },
        { label: 'MST 边数', value: String(inMst.size), role: 'frontier' },
      ])
      .commit();
  };

  render({ zh: '初始无向图', en: 'Initial undirected graph' });

  const hooks: RollbackDsuHooks = {
    onMerge: (u, v, w) => {
      inMst.add(edgeKey(u, v));
      total += w;
      examEdge = { from: u, to: v };
      render({ zh: `加入 ${u}—${v} (w=${w})`, en: `Add ${u}—${v} (w=${w})` });
      examEdge = null;
    },
    onSkip: (u, v, w) => {
      examEdge = { from: u, to: v };
      render({ zh: `跳过 ${u}—${v} (w=${w}) 成环`, en: `Skip ${u}—${v} (w=${w}) forms cycle` });
      examEdge = null;
    },
    onRollback: (steps) => {
      rollbackHappened = true;
      render({ zh: `撤销最近 ${steps} 次合并（演示）`, en: `Rollback ${steps} merges (demo)` });
    },
    onResult: (t) => {
      total = t;
    },
  };

  kruskalRollback(input, hooks);

  rec
    .begin({ zh: `完成：MST 权重 ${total}`, en: `Done: MST weight ${total}` })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        role: (inMst.has(edgeKey(e.from, e.to)) ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      { label: 'MST 权重', value: String(total), role: 'final' },
      { label: '撤销演示', value: rollbackHappened ? '已演示' : '未触发', role: 'frontier' },
    ])
    .commit();

  return rec.build();
}
