// =============================================================================
// Dinic 最大流 · 录制帧序列
// 残量网络用 setGraph 展示：增广路标 'compare'，已满流边标 'final'。
// 层级与流量统计用 setAux 展示。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dinic, type DinicHooks, type FlowNetworkInput } from './impl.ts';

/** 演示用网络：s→{a,b}, a→{c}, b→{a,c}, c→t。最大流 = 5。 */
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

/** 归一化坐标：s 居左，t 居右。 */
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
  // 当前残余容量（key "u>v"），初始化为各边容量
  const residual = new Map<string, number>();
  for (const e of input.edges) residual.set(`${e.from}>${e.to}`, e.capacity);
  // 当前流量
  const flow = new Map<string, number>();
  for (const e of input.edges) flow.set(`${e.from}>${e.to}`, 0);
  let level = new Map<string, number>();
  let augmentPath: string[] | null = null;
  let pushingEdge: { from: string; to: string } | null = null;
  let maxFlow = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (id === input.source) role = 'frontier';
      else if (id === input.sink) role = 'final';
      const lv = level.get(id);
      const lvl = lv === undefined ? '' : ` (L${lv < 0 ? '·' : lv})`;
      return {
        id,
        label: `${id}${lvl}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      const k = `${e.from}>${e.to}`;
      let role: BarRole = 'default';
      const f = flow.get(k) ?? 0;
      if (f >= e.capacity && e.capacity > 0) role = 'final';
      if (augmentPath) {
        for (let i = 0; i + 1 < augmentPath.length; i++) {
          if (augmentPath[i] === e.from && augmentPath[i + 1] === e.to) role = 'compare';
        }
      }
      if (pushingEdge && pushingEdge.from === e.from && pushingEdge.to === e.to) role = 'swap';
      return {
        from: e.from,
        to: e.to,
        directed: true,
        weight: e.capacity,
        role,
      };
    });
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '当前流 / flow', value: String(maxFlow), role: 'final' },
        {
          label: '汇点层级 / sink level',
          value:
            level.get(input.sink) !== undefined && level.get(input.sink)! >= 0
              ? String(level.get(input.sink))
              : '∞',
          role: 'frontier',
        },
      ])
      .commit();
  };

  render({
    zh: `初始网络：源 ${input.source}，汇 ${input.sink}`,
    en: `Initial network: source ${input.source}, sink ${input.sink}`,
  });

  const hooks: DinicHooks = {
    onBfsStart: (_phase, reachable) => {
      if (!reachable) {
        render({
          zh: `${input.sink} 不可达，残量图已无增广路`,
          en: `${input.sink} unreachable; no more augmenting paths`,
        });
      }
    },
    onBfsEdge: () => {},
    onBfsDone: (lv) => {
      level = lv;
      const sv = level.get(input.sink);
      if (sv !== undefined && sv >= 0) {
        render({
          zh: `BFS 分层完成：${input.sink} 在第 ${sv} 层`,
          en: `BFS leveled: ${input.sink} at level ${sv}`,
        });
      }
    },
    onPush: (u, v, pushed, res) => {
      pushingEdge = { from: u, to: v };
      const k = `${u}>${v}`;
      residual.set(k, res);
      flow.set(k, (flow.get(k) ?? 0) + pushed);
      render({
        zh: `推流 ${u}→${v}：+${pushed}（残量剩 ${res}）`,
        en: `Push ${u}→${v}: +${pushed} (residual ${res})`,
      });
      pushingEdge = null;
    },
    onAugment: (path, f) => {
      augmentPath = path;
      maxFlow += f;
      render({
        zh: `找到增广路 ${path.join('→')}，推送 ${f}，累计流 ${maxFlow}`,
        en: `Augment along ${path.join('→')} by ${f}; total flow ${maxFlow}`,
      });
      augmentPath = null;
    },
    onDone: (mf) => {
      maxFlow = mf;
    },
  };

  const result = dinic(input, hooks);

  // 终态
  augmentPath = null;
  pushingEdge = null;
  const finalNodes: GraphNode[] = nodeIds.map((id) => ({
    id,
    label: `${id} ${id === input.source || id === input.sink ? '' : ''}`,
    x: POS[id]?.x ?? 0.5,
    y: POS[id]?.y ?? 0.5,
    role: 'final' as BarRole,
  }));
  const finalEdges: GraphEdge[] = input.edges.map((e) => {
    const k = `${e.from}>${e.to}`;
    const f = result.flows.get(k) ?? 0;
    return {
      from: e.from,
      to: e.to,
      directed: true,
      weight: e.capacity,
      role: (f >= e.capacity && e.capacity > 0 ? 'final' : 'default') as BarRole,
    };
  });
  rec
    .begin({
      zh: `最大流 = ${result.maxFlow}`,
      en: `Max flow = ${result.maxFlow}`,
    })
    .setGraph(finalNodes, finalEdges)
    .setAux([
      { label: '最大流 / max flow', value: String(result.maxFlow), role: 'final' },
      {
        label: '满流边数 / saturated',
        value: String(
          [...result.flows.values()].filter((f, i) => {
            const e = input.edges[i]!;
            return f >= e.capacity && e.capacity > 0;
          }).length,
        ),
        role: 'frontier',
      },
    ])
    .commit();

  return rec.build();
}
