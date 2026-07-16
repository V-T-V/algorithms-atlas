// =============================================================================
// SAP 最大流 · 录制帧序列
// 可视化：setGraph（残量网络），role:增广路='compare'，满流边='final'，
// 当前推送段='swap'，重标号节点='pivot'。setAux 展示距离标号与累计流。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sap, type FlowNetworkInput, type SapHooks } from './impl.ts';

/** 演示网络：s→{a,b}, a→{b,c}, b→c, c→t, b→t。最大流 = 5。 */
export const DEFAULT_INPUT: FlowNetworkInput = {
  nodes: ['s', 'a', 'b', 'c', 'd', 't'],
  edges: [
    { from: 's', to: 'a', capacity: 3 },
    { from: 's', to: 'b', capacity: 2 },
    { from: 'a', to: 'b', capacity: 1 },
    { from: 'a', to: 'c', capacity: 3 },
    { from: 'b', to: 'c', capacity: 2 },
    { from: 'c', to: 'd', capacity: 4 },
    { from: 'd', to: 't', capacity: 5 },
    { from: 'b', to: 't', capacity: 1 },
  ],
  source: 's',
  sink: 't',
};

const POS: Record<string, { x: number; y: number }> = {
  s: { x: 0.1, y: 0.5 },
  a: { x: 0.32, y: 0.22 },
  b: { x: 0.32, y: 0.78 },
  c: { x: 0.56, y: 0.5 },
  d: { x: 0.78, y: 0.5 },
  t: { x: 0.92, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: FlowNetworkInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = input.nodes;
  const flow = new Map<string, number>();
  for (const e of input.edges) flow.set(`${e.from}>${e.to}`, 0);
  let dist = new Map<string, number>();
  let augmentPath: string[] | null = null;
  let pushEdge: { from: string; to: string } | null = null;
  let relabelNode: string | null = null;
  let maxFlow = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (id === input.source) role = 'frontier';
      else if (id === input.sink) role = 'final';
      if (id === relabelNode) role = 'pivot';
      const dv = dist.get(id);
      const dStr = dv === undefined ? '' : ` d=${dv >= nodeIds.length ? '∞' : dv}`;
      return { id, label: `${id}${dStr}`, x: POS[id]?.x ?? 0.5, y: POS[id]?.y ?? 0.5, role };
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
      return { from: e.from, to: e.to, directed: true, weight: e.capacity, role };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '当前流 / flow', value: String(maxFlow), role: 'final' }])
      .commit();
  };

  render({
    zh: `初始网络：源 ${input.source}，汇 ${input.sink}`,
    en: `Initial network: source ${input.source}, sink ${input.sink}`,
  });

  const hooks: SapHooks = {
    onInitLabel: (d) => {
      dist = d;
      render({ zh: '反向 BFS 初始化距离标号', en: 'Reverse BFS: init distance labels' });
    },
    onPush: (u, v, pushed, res) => {
      pushEdge = { from: u, to: v };
      const k = `${u}>${v}`;
      flow.set(k, (flow.get(k) ?? 0) + pushed);
      render({
        zh: `推流 ${u}→${v}：+${pushed}（残量 ${res}）`,
        en: `Push ${u}->${v}: +${pushed} (residual ${res})`,
      });
      pushEdge = null;
    },
    onRelabel: (u, oldD, newD) => {
      relabelNode = u;
      dist.set(u, newD);
      render({ zh: `重标号 ${u}：d ${oldD} → ${newD}`, en: `Relabel ${u}: d ${oldD} -> ${newD}` });
      relabelNode = null;
    },
    onAugment: (path, f) => {
      augmentPath = path;
      maxFlow += f;
      render({
        zh: `增广路 ${path.join('→')}：+${f}，累计 ${maxFlow}`,
        en: `Augment ${path.join('->')}: +${f}; total ${maxFlow}`,
      });
      augmentPath = null;
    },
    onGap: (dLevel) => {
      render({
        zh: `gap 优化：标号 ${dLevel} 上节点数为 0`,
        en: `Gap: no node at level ${dLevel}`,
      });
    },
    onDone: (mf) => {
      maxFlow = mf;
    },
  };

  const result = sap(input, hooks);

  rec
    .begin({ zh: `最大流 = ${result.maxFlow}`, en: `Max flow = ${result.maxFlow}` })
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
          weight: e.capacity,
          role: (f >= e.capacity ? 'final' : 'default') as BarRole,
        };
      }),
    )
    .setAux([{ label: '最大流', value: String(result.maxFlow), role: 'final' }])
    .commit();

  return rec.build();
}
