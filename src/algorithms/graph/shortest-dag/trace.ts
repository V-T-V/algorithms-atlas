// =============================================================================
// DAG 最短路 · 录制帧序列
// 可视化：setGraph（DAG），role:已处理='final'，当前处理='pivot'，松弛='compare'，
// 源='frontier'。setAux 展示拓扑序与当前距离。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestDag, type GraphInput, type ShortestDagHooks } from './impl.ts';

/** 演示 DAG（含负权，DAG 无负环）：
 *   s→a(2), s→b(6)
 *   a→b(1), a→c(3)
 *   b→c(-2)   ← 负权边
 *   c→t(4)
 *   最短路 s→a→b→c→t = 2+1-2+4 = 5 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['s', 'a', 'b', 'c', 't'],
  edges: [
    { from: 's', to: 'a', weight: 2 },
    { from: 's', to: 'b', weight: 6 },
    { from: 'a', to: 'b', weight: 1 },
    { from: 'a', to: 'c', weight: 3 },
    { from: 'b', to: 'c', weight: -2 },
    { from: 'c', to: 't', weight: 4 },
  ],
  source: 's',
};

const POS: Record<string, { x: number; y: number }> = {
  s: { x: 0.08, y: 0.5 },
  a: { x: 0.3, y: 0.25 },
  b: { x: 0.3, y: 0.75 },
  c: { x: 0.62, y: 0.5 },
  t: { x: 0.92, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const dist = new Map<string, number>();
  for (const n of nodeIds) dist.set(n, Infinity);
  dist.set(input.source, 0);
  const done = new Set<string>();
  let curNode: string | null = null;
  let relaxEdge: { from: string; to: string } | null = null;
  let topoStr = '';

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (id === input.source) role = 'frontier';
      if (done.has(id)) role = 'final';
      if (id === curNode) role = 'pivot';
      const dv = dist.get(id) ?? Infinity;
      const dStr = dv === Infinity ? '∞' : String(dv);
      return { id, label: `${id}\nd=${dStr}`, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      directed: true,
      weight: e.weight,
      role: relaxEdge && relaxEdge.from === e.from && relaxEdge.to === e.to ? 'compare' : 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '拓扑序', value: topoStr || '∅', role: 'frontier' },
        { label: '源', value: input.source, role: 'pivot' },
      ])
      .commit();
  };

  render({ zh: `初始 DAG，源 ${input.source}`, en: `Initial DAG, source ${input.source}` });

  const hooks: ShortestDagHooks = {
    onTopoOrder: (order) => {
      topoStr = order.join('→');
      render({ zh: `拓扑序：${order.join('→')}`, en: `Topo order: ${order.join('->')}` });
    },
    onVisit: (u, d) => {
      curNode = u;
      render({
        zh: `按拓扑序处理 ${u}（距离 ${d === Infinity ? '∞' : d}）`,
        en: `Process ${u} in topo order (dist ${d === Infinity ? '∞' : d})`,
      });
      done.add(u);
      curNode = null;
    },
    onRelax: (from, to, nd, improved) => {
      relaxEdge = { from, to };
      if (improved) {
        dist.set(to, nd);
        render({ zh: `松弛 ${from}→${to}：d=${nd} ✓`, en: `Relax ${from}->${to}: d=${nd} OK` });
      } else {
        render({ zh: `${from}→${to}：不更新`, en: `${from}->${to}: no update` });
      }
      relaxEdge = null;
    },
    onDone: () => {
      render({ zh: '完成', en: 'Done' });
    },
  };

  shortestDag(input, hooks);

  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      nodeIds.map((id) => {
        const dv = dist.get(id) ?? Infinity;
        return {
          id,
          label: `${id}\nd=${dv === Infinity ? '∞' : dv}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: 'final' as BarRole,
        };
      }),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        directed: true,
        weight: e.weight,
        role: 'default' as BarRole,
      })),
    )
    .setAux([{ label: '到 t 的距离', value: String(dist.get('t') ?? Infinity), role: 'final' }])
    .commit();

  return rec.build();
}
