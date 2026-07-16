// =============================================================================
// Kruskal 最小生成树 · 录制帧序列
// 通过 kruskal 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kruskal, type GraphInput, type KruskalHooks } from './impl.ts';

/** 演示用加权无向图：6 节点。 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 6 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 9 },
    { from: 'D', to: 'E', weight: 7 },
    { from: 'D', to: 'F', weight: 8 },
    { from: 'E', to: 'F', weight: 1 },
  ],
};

/** 归一化坐标：环形布局便于看清。 */
const POS: Record<string, { x: number; y: number }> = (() => {
  const ring = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cx = 0.5;
  const cy = 0.5;
  const r = 0.34;
  const pos: Record<string, { x: number; y: number }> = {};
  ring.forEach((id, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length;
    pos[id] = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  });
  return pos;
})();

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;

  const mstEdges = new Set<string>(); // "from>to" 或 "to>from"
  const rejectedEdges = new Set<string>();
  let examEdge: { from: string; to: string } | null = null;
  let totalWeight = 0;

  const edgeKey = (a: string, b: string): string => (a < b ? `${a}>${b}` : `${b}>${a}`);

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: 'frontier' as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      if (mstEdges.has(edgeKey(e.from, e.to))) role = 'final';
      else if (rejectedEdges.has(edgeKey(e.from, e.to))) role = 'warn';
      if (examEdge && examEdge.from === e.from && examEdge.to === e.to) role = 'compare';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: 'MST 权重 / weight', value: String(totalWeight), role: 'final' },
        { label: '已选 / picked', value: String(mstEdges.size), role: 'frontier' },
      ])
      .commit();
  };

  render({
    zh: `${nodeIds.length} 节点 ${input.edges.length} 边，按权重升序逐条考察`,
    en: `${nodeIds.length} nodes, ${input.edges.length} edges; examine in ascending weight`,
  });

  const hooks: KruskalHooks = {
    onExamine: (from, to, w, accepted) => {
      examEdge = { from, to };
      render({
        zh: `考察 ${from}—${to} (w=${w})：${accepted ? '不成环，纳入 MST' : '成环，丢弃'}`,
        en: `Examine ${from}—${to} (w=${w}): ${accepted ? 'no cycle, accept' : 'cycle, reject'}`,
      });
      if (!accepted) rejectedEdges.add(edgeKey(from, to));
      examEdge = null;
    },
    onTreeEdge: (from, to, w) => {
      mstEdges.add(edgeKey(from, to));
      totalWeight += w;
      render({
        zh: `纳入 ${from}—${to} (w=${w})，累计 ${totalWeight}`,
        en: `Accept ${from}—${to} (w=${w}), total ${totalWeight}`,
      });
    },
    onDone: (tw, n) => {
      totalWeight = tw;
      render({
        zh: `完成：MST 共 ${n} 条边，总权重 ${tw}`,
        en: `Done: MST has ${n} edges, total weight ${tw}`,
      });
    },
  };

  kruskal(input, hooks);

  // 终态
  examEdge = null;
  rec
    .begin({
      zh: `最小生成树完成，总权重 ${totalWeight}`,
      en: `MST complete, total weight ${totalWeight}`,
    })
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
        role: (mstEdges.has(edgeKey(e.from, e.to)) ? 'final' : 'default') as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
