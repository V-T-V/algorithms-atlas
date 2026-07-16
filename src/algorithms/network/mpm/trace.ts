// =============================================================================
// MPM 算法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mpm, type MpmEdgeInput, type MpmHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 5,
  edges: [
    { from: 0, to: 1, cap: 10 },
    { from: 0, to: 2, cap: 10 },
    { from: 1, to: 2, cap: 2 },
    { from: 1, to: 3, cap: 4 },
    { from: 1, to: 4, cap: 8 },
    { from: 2, to: 3, cap: 9 },
    { from: 3, to: 4, cap: 10 },
  ] as MpmEdgeInput[],
  s: 0,
  t: 4,
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.1, y: 0.5 },
  1: { x: 0.38, y: 0.22 },
  2: { x: 0.38, y: 0.78 },
  3: { x: 0.66, y: 0.5 },
  4: { x: 0.92, y: 0.5 },
};

export function buildTrace(
  input: { n: number; edges: MpmEdgeInput[]; s: number; t: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, s, t } = input;

  const flow = new Map<string, number>(edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const removedNodes = new Set<number>();
  let step = 0;

  const render = (note: { zh: string; en: string }, highlight: Set<number> = new Set()): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (i === s || i === t) role = 'pivot';
      if (removedNodes.has(i)) role = 'swap';
      if (highlight.has(i)) role = 'compare';
      nodes.push({
        id: String(i),
        label: String(i),
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      let role: BarRole = 'default';
      if (f > 0) role = 'frontier';
      return { from: String(e.from), to: String(e.to), weight: e.cap, directed: true, role };
    });
    const aux = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      return {
        label: `${e.from}→${e.to}`,
        value: `${f}/${e.cap}`,
        role: (f > 0 ? 'frontier' : 'default') as BarRole,
      };
    });
    aux.push({ label: '步数', value: String(step), role: 'pivot' });
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({ zh: `初始网络：源 ${s}，汇 ${t}`, en: `Initial network: source ${s}, sink ${t}` });

  const hooks: MpmHooks = {
    onLevel: (_level, reachable) => {
      step += 1;
      render({
        zh: reachable ? `BFS 分层：汇点可达` : `BFS 分层：汇点不可达，结束`,
        en: reachable ? `BFS level graph built` : `BFS: sink unreachable`,
      });
    },
    onPotential: (pots, bottleneckNode, bottleneckValue) => {
      step += 1;
      const hl = new Set<number>([bottleneckNode]);
      const potStr = pots.map((p, i) => `${i}:${p === Infinity ? '∞' : p}`).join(' ');
      render(
        {
          zh: `计算潜在通过量：[${potStr}]，瓶颈 = 节点 ${bottleneckNode}（pot=${bottleneckValue}）`,
          en: `Pots: [${potStr}], bottleneck = node ${bottleneckNode} (pot=${bottleneckValue})`,
        },
        hl,
      );
    },
    onPush: (nodes, f, total) => {
      step += 1;
      // 推送后更新流量（这里近似：直接用累计值）
      removedNodes.add(nodes[0]!);
      render({
        zh: `从节点 ${nodes.join(',')} 推 ${f} 单位（累计 ${total}），然后移除该节点`,
        en: `Push ${f} from node ${nodes.join(',')} (total ${total}); remove it`,
      });
    },
    onPhase: (phase, phaseFlow) => {
      removedNodes.clear();
      render({
        zh: `阶段 ${phase} 完成，本阶段推进 ${phaseFlow}`,
        en: `Phase ${phase} done, pushed ${phaseFlow} this phase`,
      });
    },
  };

  const result = mpm(n, edges, s, t, hooks);

  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: String(i),
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: 'final' as BarRole,
    });
  }
  rec
    .begin({ zh: `完成，最大流 = ${result}`, en: `Done, max flow = ${result}` })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: String(e.from),
        to: String(e.to),
        weight: e.cap,
        directed: true,
        role: ((flow.get(`${e.from}>${e.to}`) ?? 0) > 0 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux(
      edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `${flow.get(`${e.from}>${e.to}`) ?? 0}/${e.cap}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
