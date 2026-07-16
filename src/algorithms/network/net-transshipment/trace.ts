// 转运问题 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { transshipment, type TransshipmentInput } from './impl.ts';

export const DEFAULT_INPUT: TransshipmentInput = {
  n: 4,
  // 0=供应(+10), 1=转运, 2=转运, 3=需求(-10)
  balance: [10, 0, 0, -10],
  edges: [
    { from: 0, to: 1, cap: 10, cost: 1 },
    { from: 0, to: 2, cap: 10, cost: 4 },
    { from: 1, to: 3, cap: 10, cost: 2 },
    { from: 2, to: 3, cap: 10, cost: 1 },
    { from: 1, to: 2, cap: 10, cost: 1 },
  ],
};

export function buildTrace(input: TransshipmentInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = transshipment(input);
  const POS: Record<number, { x: number; y: number }> = {
    0: { x: 0.1, y: 0.5 },
    1: { x: 0.38, y: 0.2 },
    2: { x: 0.38, y: 0.8 },
    3: { x: 0.9, y: 0.5 },
  };
  const nodes: GraphNode[] = Array.from({ length: input.n }, (_, i) => {
    const b = input.balance[i]!;
    const role: BarRole = b > 0 ? 'pivot' : b < 0 ? 'final' : 'default';
    return {
      id: String(i),
      label: `${i}(${b > 0 ? '+' : ''}${b})`,
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role,
    };
  });
  const edges: GraphEdge[] = input.edges.map((e) => ({
    from: String(e.from),
    to: String(e.to),
    weight: e.cost,
    directed: true,
    role: 'frontier' as BarRole,
  }));

  rec
    .begin({ zh: `转运网络：${input.n} 节点`, en: `Transshipment: ${input.n} nodes` })
    .setGraph(nodes, edges)
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `cap${e.cap}/c${e.cost}`,
        role: 'default' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `最小运费 = ${result.totalCost}，流量 ${result.totalFlow}`,
      en: `Min cost = ${result.totalCost}, flow ${result.totalFlow}`,
    })
    .setGraph(nodes, edges)
    .setAux([{ label: 'cost', value: String(result.totalCost), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
