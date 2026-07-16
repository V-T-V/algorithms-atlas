// =============================================================================
// SPFA 负环检测 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spfaNegativeCycle, type GraphInput, type SpfaHooks } from './impl.ts';

// 含负环：A→B(1), B→C(-2), C→A(-2) 总和 -3 < 0 形成负环
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: -2 },
    { from: 'C', to: 'A', weight: -2 },
    { from: 'D', to: 'A', weight: 3 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.3, y: 0.3 },
  B: { x: 0.6, y: 0.3 },
  C: { x: 0.45, y: 0.7 },
  D: { x: 0.05, y: 0.3 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const dist = new Map<string, number>();
  const cnt = new Map<string, number>();
  for (const n of nodeIds) {
    dist.set(n, Infinity);
    cnt.set(n, 0);
  }
  const queue: string[] = [];
  let cur: string | null = null;
  let examEdge: { from: string; to: string } | null = null;
  let result = false;

  const fmt = (id: string): string => {
    const v = dist.get(id);
    return v === undefined || v === Infinity ? '∞' : String(v);
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (queue.includes(id)) role = 'frontier';
      if (id === cur) role = 'compare';
      return {
        id,
        label: `${id}\nd=${fmt(id)}\n入队${cnt.get(id) ?? 0}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, directed: true, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'dist', value: nodeIds.map((n) => `${n}:${fmt(n)}`).join('  ') },
        { label: '队列', value: queue.length ? queue.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  render({ zh: '超级源点：所有点 d=0 入队', en: 'Super source: all vertices d=0 enqueued' });

  const hooks: SpfaHooks = {
    onEnqueue: (v, c) => {
      cnt.set(v, c);
      if (!queue.includes(v)) queue.push(v);
    },
    onDequeue: (v) => {
      const i = queue.indexOf(v);
      if (i >= 0) queue.splice(i, 1);
    },
    onRelax: (u, v, nd) => {
      dist.set(v, nd);
      examEdge = { from: u, to: v };
      cur = u;
      render({ zh: `松弛 ${u}→${v}：d=${nd}`, en: `Relax ${u}→${v}: d=${nd}` });
      examEdge = null;
    },
    onResult: (has) => {
      result = has;
      cur = null;
    },
  };

  spfaNegativeCycle(input, hooks);

  rec
    .begin(
      result
        ? { zh: '检测到负环', en: 'Negative cycle detected' }
        : { zh: '无负环', en: 'No negative cycle' },
    )
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: (result ? 'warn' : 'final') as BarRole,
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
      { label: '结论', value: result ? '存在负环' : '无负环', role: result ? 'warn' : 'final' },
    ])
    .commit();

  return rec.build();
}
