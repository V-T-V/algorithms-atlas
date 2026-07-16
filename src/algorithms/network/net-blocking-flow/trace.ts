// 阻塞流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blockingFlowTracked, type BlockGraph, type BlockEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 5,
  source: 0,
  sink: 4,
  graph: new Map<number, BlockEdge[]>([
    [
      0,
      [
        { to: 1, cap: 3 },
        { to: 2, cap: 2 },
      ],
    ],
    [
      1,
      [
        { to: 3, cap: 2 },
        { to: 2, cap: 1 },
      ],
    ],
    [2, [{ to: 3, cap: 3 }]],
    [3, [{ to: 4, cap: 4 }]],
    [4, []],
  ]) as BlockGraph,
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const POS: Record<number, { x: number; y: number }> = {
    0: { x: 0.1, y: 0.5 },
    1: { x: 0.35, y: 0.2 },
    2: { x: 0.35, y: 0.8 },
    3: { x: 0.65, y: 0.5 },
    4: { x: 0.9, y: 0.5 },
  };
  const mkNodes = (role: BarRole): GraphNode[] =>
    Array.from({ length: input.n }, (_, i) => ({
      id: String(i),
      label: String(i),
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: (i === input.source ? 'pivot' : i === input.sink ? 'final' : role) as BarRole,
    }));
  const mkEdges = (g: BlockGraph): GraphEdge[] => {
    const es: GraphEdge[] = [];
    for (let u = 0; u < input.n; u++)
      for (const a of g.get(u) ?? [])
        es.push({
          from: String(u),
          to: String(a.to),
          weight: a.cap,
          directed: true,
          role: 'frontier' as BarRole,
        });
    return es;
  };

  rec
    .begin({ zh: `分层图上求阻塞流`, en: `Find blocking flow on level graph` })
    .setGraph(mkNodes('default'), mkEdges(input.graph))
    .commit();

  // 复制图以避免修改原输入
  const work: BlockGraph = new Map();
  for (let u = 0; u < input.n; u++)
    work.set(
      u,
      (input.graph.get(u) ?? []).map((a) => ({ ...a })),
    );
  const { total, paths } = blockingFlowTracked(work, input.n, input.source, input.sink);

  paths.forEach((p, i) => {
    rec
      .begin({
        zh: `增广路 #${i + 1}：${p.path.join('→')} × ${p.flow}`,
        en: `Path #${i + 1}: ${p.path.join('→')} × ${p.flow}`,
      })
      .setAux([
        { label: 'path', value: `${p.path.join('→')}=${p.flow}`, role: 'compare' as BarRole },
      ])
      .commit();
  });

  rec
    .begin({ zh: `阻塞流总量 = ${total}`, en: `Blocking flow total = ${total}` })
    .setGraph(mkNodes('final'), mkEdges(work))
    .setAux([{ label: 'total', value: String(total), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
