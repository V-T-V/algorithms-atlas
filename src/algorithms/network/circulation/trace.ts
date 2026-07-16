// =============================================================================
// 上下界可行环流 · 录制帧序列
// 用 setGraph 展示流网络（边权显示 lo/hi），setAux 展示各节点盈余与可行性。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circulation, type CircEdgeInput, type CircHooks } from './impl.ts';

/** 演示：3 节点环，可行。 */
export const DEFAULT_INPUT = {
  n: 3,
  edges: [
    { from: 0, to: 1, lo: 1, hi: 3 },
    { from: 1, to: 2, lo: 2, hi: 4 },
    { from: 2, to: 0, lo: 1, hi: 3 },
  ] as CircEdgeInput[],
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.25, y: 0.2 },
  1: { x: 0.8, y: 0.4 },
  2: { x: 0.35, y: 0.85 },
};

export function buildTrace(input: { n: number; edges: CircEdgeInput[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges } = input;
  const d = new Array<number>(n).fill(0);
  let feasible = false;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (d[i]! > 0) role = 'compare';
      else if (d[i]! < 0) role = 'warn';
      nodes.push({
        id: String(i),
        label: `${i}\nd=${d[i]}`,
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => ({
      from: String(e.from),
      to: String(e.to),
      directed: true,
      role: 'default',
    }));
    const aux = [
      ...edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `[${e.lo}, ${e.hi}]`,
        role: 'default' as BarRole,
      })),
      ...d.map((x, i) => ({
        label: `d[${i}]`,
        value: String(x),
        role: (x > 0 ? 'compare' : x < 0 ? 'warn' : 'final') as BarRole,
      })),
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({
    zh: `初始网络：${n} 节点，每条边有 [lo, hi]`,
    en: `Initial: ${n} nodes, each edge has [lo, hi]`,
  });

  const hooks: CircHooks = {
    onExcess: (dd) => {
      for (let i = 0; i < n; i++) d[i] = dd[i]!;
      render({
        zh: `计算节点盈余 d[u] = 出下界 − 入下界`,
        en: `Compute node excess d[u] = out-lower − in-lower`,
      });
    },
    onSuperGraph: (_ss, _tt, demand) => {
      render({
        zh: `构造超级源汇，总需求 = ${demand}，跑最大流`,
        en: `Build super source/sink, total demand = ${demand}, run max-flow`,
      });
    },
    onResult: (ok) => {
      feasible = ok;
      render({
        zh: ok ? `最大流满足全部需求 → 可行` : `最大流不足 → 不可行`,
        en: ok ? `Max-flow meets all demands → feasible` : `Max-flow insufficient → infeasible`,
      });
    },
  };

  circulation(n, edges, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: String(i),
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: 'final',
    });
  }
  rec
    .begin({
      zh: feasible ? `完成：存在可行环流` : `完成：无可行环流`,
      en: feasible ? `Done: feasible circulation exists` : `Done: no feasible circulation`,
    })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: String(e.from),
        to: String(e.to),
        directed: true,
        role: (feasible ? 'final' : 'warn') as BarRole,
      })),
    )
    .setAux([
      {
        label: '结果',
        value: feasible ? '可行' : '不可行',
        role: (feasible ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
