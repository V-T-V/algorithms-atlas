// =============================================================================
// 0-1 BFS · 录制帧序列
// 可视化：setGraph（加权图），role:已确定='final'，当前松弛='compare'，
// 起点源='pivot'，队中未定='frontier'。setAux 展示当前最短距离。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zeroOneBfs, type GraphInput, type ZeroOneBfsHooks } from './impl.ts';

/** 演示图（边权 0/1）：
 *   s -1- a -0- b
 *   |1       |1
 *   c -0- d -1- t
 *   s→a(1), a→b(0), s→c(1), b→t(1), c→d(0), d→t(1)
 *   最短路 s→c→d→t = 1+0+1 = 2；s→a→b→t = 1+0+1 = 2（并列） */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['s', 'a', 'b', 'c', 'd', 't'],
  edges: [
    { from: 's', to: 'a', weight: 1 },
    { from: 'a', to: 'b', weight: 0 },
    { from: 's', to: 'c', weight: 1 },
    { from: 'b', to: 't', weight: 1 },
    { from: 'c', to: 'd', weight: 0 },
    { from: 'd', to: 't', weight: 1 },
  ],
  source: 's',
  directed: true,
};

const POS: Record<string, { x: number; y: number }> = {
  s: { x: 0.08, y: 0.5 },
  a: { x: 0.3, y: 0.22 },
  b: { x: 0.55, y: 0.22 },
  c: { x: 0.3, y: 0.78 },
  d: { x: 0.55, y: 0.78 },
  t: { x: 0.92, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const dist = new Map<string, number>();
  for (const n of nodeIds) dist.set(n, Infinity);
  const settled = new Set<string>();
  const inQueue = new Set<string>();
  let curNode: string | null = null;
  let relaxEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (inQueue.has(id)) role = 'frontier';
      if (settled.has(id)) role = 'final';
      if (id === input.source) role = 'pivot';
      if (id === curNode) role = 'compare';
      const dv = dist.get(id) ?? Infinity;
      const dStr = dv === Infinity ? '∞' : String(dv);
      return { id, label: `${id}\nd=${dStr}`, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      directed: input.directed,
      weight: e.weight,
      role: relaxEdge && relaxEdge.from === e.from && relaxEdge.to === e.to ? 'compare' : 'default',
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '源 / source', value: input.source, role: 'pivot' }])
      .commit();
  };

  render({ zh: `初始图，源 ${input.source}`, en: `Initial graph, source ${input.source}` });

  const hooks: ZeroOneBfsHooks = {
    onInit: (s) => {
      dist.set(s, 0);
      inQueue.add(s);
      render({ zh: `初始化：${s} 距离 0`, en: `Init: ${s} dist 0` });
    },
    onPop: (u, d) => {
      inQueue.delete(u);
      settled.add(u);
      curNode = u;
      render({ zh: `取出 ${u}（距离 ${d}）`, en: `Pop ${u} (dist ${d})` });
      curNode = null;
    },
    onRelax: (from, to, w, nd, improved) => {
      relaxEdge = { from, to };
      if (improved) {
        dist.set(to, nd);
        inQueue.add(to);
        render({
          zh: `松弛 ${from}→${to}（权 ${w}）：d=${nd} ✓`,
          en: `Relax ${from}->${to} (w ${w}): d=${nd} OK`,
        });
      } else {
        render({
          zh: `${from}→${to}（权 ${w}）：不更新`,
          en: `${from}->${to} (w ${w}): no update`,
        });
      }
      relaxEdge = null;
    },
    onDone: () => {
      render({ zh: '完成', en: 'Done' });
    },
  };

  zeroOneBfs(input, hooks);

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
        directed: input.directed,
        weight: e.weight,
        role: 'default' as BarRole,
      })),
    )
    .setAux([{ label: '到 t 的距离', value: String(dist.get('t') ?? Infinity), role: 'final' }])
    .commit();

  return rec.build();
}
