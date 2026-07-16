// 带需求环流可行性 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circulationFeasible, type BoundEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  nodes: ['A', 'B', 'C'],
  edges: [
    { from: 'A', to: 'B', lower: 1, upper: 4 },
    { from: 'B', to: 'C', lower: 2, upper: 5 },
    { from: 'C', to: 'A', lower: 1, upper: 4 },
  ] as BoundEdge[],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = circulationFeasible(input.nodes, input.edges);

  rec
    .begin({
      zh: `带下界环流：${input.edges.length} 条边`,
      en: `Lower-bounded circulation: ${input.edges.length} edges`,
    })
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `[${e.lower},${e.upper}]`,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `归约最大流 ${result.maxFlow}/${result.required}`,
      en: `Reduced max flow ${result.maxFlow}/${result.required}`,
    })
    .setAux([
      {
        label: 'reduced',
        value: `${result.maxFlow}/${result.required}`,
        role: 'compare' as BarRole,
      },
    ])
    .commit();

  rec
    .begin({
      zh: result.feasible ? `可行环流` : `不可行`,
      en: result.feasible ? `Feasible` : `Infeasible`,
    })
    .setAux(
      result.feasible
        ? result.circulation.map((c) => ({
            label: `${c.from}→${c.to}`,
            value: String(c.flow),
            role: 'final' as BarRole,
          }))
        : [{ label: 'result', value: 'infeasible', role: 'warn' as BarRole }],
    )
    .commit();
  return rec.build();
}
