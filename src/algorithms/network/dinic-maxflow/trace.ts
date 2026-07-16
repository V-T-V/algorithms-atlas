// =============================================================================
// Dinic 最大流 · 录制帧序列
// 用 setGraph 展示流网络，分层/增广阶段高亮；setAux 展示各边 flow/cap。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dinic, type DinicEdgeInput, type DinicHooks } from './impl.ts';

/** 演示网络：5 节点，源 0，汇 4，最大流 = 18。 */
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
  ] as DinicEdgeInput[],
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
  input: { n: number; edges: DinicEdgeInput[]; s: number; t: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, s, t } = input;

  const flow = new Map<string, number>(edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const pathEdges = new Set<string>();
  let curPath: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (i === s || i === t) role = 'pivot';
      if (curPath.includes(i)) role = 'compare';
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
      if (pathEdges.has(key)) role = 'compare';
      return { from: String(e.from), to: String(e.to), weight: e.cap, directed: true, role };
    });
    const aux = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      return {
        label: `${e.from}→${e.to}`,
        value: `${f}/${e.cap}`,
        role: (pathEdges.has(key) ? 'compare' : f > 0 ? 'frontier' : 'default') as BarRole,
      };
    });
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({ zh: `初始网络：源 ${s}，汇 ${t}`, en: `Initial network: source ${s}, sink ${t}` });

  const hooks: DinicHooks = {
    onLevel: (_level, reachable) => {
      render({
        zh: reachable ? `BFS 分层：汇点可达` : `BFS 分层：汇点不可达，结束`,
        en: reachable ? `BFS level graph built` : `BFS: sink unreachable, done`,
      });
    },
    onAugment: (path, f, total) => {
      pathEdges.clear();
      for (let i = 0; i + 1 < path.length; i++) {
        pathEdges.add(`${path[i]!}>${path[i + 1]!}`);
      }
      curPath = path;
      render({
        zh: `DFS 增广 ${path.join('→')}，瓶颈 ${f}，累计 ${total}`,
        en: `DFS augment ${path.join('→')}, bottleneck ${f}, total ${total}`,
      });
      for (let i = 0; i + 1 < path.length; i++) {
        const key = `${path[i]!}>${path[i + 1]!}`;
        if (flow.has(key)) flow.set(key, (flow.get(key) ?? 0) + f);
      }
      pathEdges.clear();
      curPath = [];
    },
    onPhase: (phase, phaseFlow) => {
      render({
        zh: `阶段 ${phase} 阻塞流 = ${phaseFlow}`,
        en: `Phase ${phase} blocking flow = ${phaseFlow}`,
      });
    },
  };

  const result = dinic(n, edges, s, t, hooks);

  // 终态
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
