// =============================================================================
// 最小费用最大流 · 录制帧序列
// 可视化：setGraph（残量网络），role:增广路='compare'，满流边='final'，
// 当前推送段='swap'。setAux 展示累计流与累计费用。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mcmf, type FlowNetworkInput, type McmfHooks } from './impl.ts';

/** 演示网络：s→a→b→t 与 s→a→t 两条路径，费用不同。
 *   s → a (cap 4, cost 1)
 *   a → b (cap 2, cost 2)
 *   a → t (cap 2, cost 5)
 *   b → t (cap 3, cost 1)
 *   s → b (cap 3, cost 4)
 * 最大流 = 5，最小费用 = ?  */
export const DEFAULT_INPUT: FlowNetworkInput = {
  nodes: ['s', 'a', 'b', 't'],
  edges: [
    { from: 's', to: 'a', capacity: 4, cost: 1 },
    { from: 's', to: 'b', capacity: 3, cost: 4 },
    { from: 'a', to: 'b', capacity: 2, cost: 2 },
    { from: 'a', to: 't', capacity: 2, cost: 5 },
    { from: 'b', to: 't', capacity: 3, cost: 1 },
  ],
  source: 's',
  sink: 't',
};

const POS: Record<string, { x: number; y: number }> = {
  s: { x: 0.1, y: 0.5 },
  a: { x: 0.36, y: 0.25 },
  b: { x: 0.36, y: 0.75 },
  t: { x: 0.9, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: FlowNetworkInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const flow = new Map<string, number>();
  for (const e of input.edges) flow.set(`${e.from}>${e.to}`, 0);
  let augmentPath: string[] | null = null;
  let pushEdge: { from: string; to: string } | null = null;
  let maxFlow = 0;
  let minCost = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (id === input.source) role = 'frontier';
      else if (id === input.sink) role = 'final';
      return { id, label: id, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      let role: BarRole = 'default';
      const k = `${e.from}>${e.to}`;
      const f = flow.get(k) ?? 0;
      if (f >= e.capacity) role = 'final';
      if (augmentPath) {
        for (let i = 0; i + 1 < augmentPath.length; i++) {
          if (augmentPath[i] === e.from && augmentPath[i + 1] === e.to) role = 'compare';
        }
      }
      if (pushEdge && pushEdge.from === e.from && pushEdge.to === e.to) role = 'swap';
      return {
        from: e.from,
        to: e.to,
        directed: true,
        weight: e.cost,
        label: `${f}/${e.capacity}`,
        role,
      };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '流量 / flow', value: String(maxFlow), role: 'final' },
        { label: '费用 / cost', value: String(minCost), role: 'pivot' },
      ])
      .commit();
  };

  render({
    zh: `初始费用网络：源 ${input.source}，汇 ${input.sink}`,
    en: `Initial cost network: source ${input.source}, sink ${input.sink}`,
  });

  const hooks: McmfHooks = {
    onPush: (u, v, pushed, uc) => {
      pushEdge = { from: u, to: v };
      const k = `${u}>${v}`;
      flow.set(k, (flow.get(k) ?? 0) + pushed);
      render({
        zh: `推流 ${u}→${v}：+${pushed}（单位费用 ${uc}）`,
        en: `Push ${u}->${v}: +${pushed} (unit cost ${uc})`,
      });
      pushEdge = null;
    },
    onAugment: (path, f, uc) => {
      augmentPath = path;
      maxFlow += f;
      minCost += f * uc;
      render({
        zh: `最短费用路 ${path.join('→')}：+${f} 流，单位费用 ${uc}`,
        en: `Cheapest path ${path.join('->')}: +${f} flow, unit cost ${uc}`,
      });
      augmentPath = null;
    },
    onDone: (tf, tc) => {
      maxFlow = tf;
      minCost = tc;
    },
  };

  const result = mcmf(input, hooks);

  augmentPath = null;
  pushEdge = null;
  rec
    .begin({
      zh: `最大流 = ${result.maxFlow}，最小费用 = ${result.minCost}`,
      en: `Max flow = ${result.maxFlow}, min cost = ${result.minCost}`,
    })
    .setGraph(
      nodeIds.map((id) => ({
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => {
        const k = `${e.from}>${e.to}`;
        const f = result.flows.get(k) ?? 0;
        return {
          from: e.from,
          to: e.to,
          directed: true,
          weight: e.cost,
          label: `${f}/${e.capacity}`,
          role: (f >= e.capacity ? 'final' : 'default') as BarRole,
        };
      }),
    )
    .setAux([
      { label: '最大流', value: String(result.maxFlow), role: 'final' },
      { label: '最小费用', value: String(result.minCost), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
