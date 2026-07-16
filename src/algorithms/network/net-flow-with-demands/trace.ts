// 带下界最大流 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxFlowWithDemands, type LowerBoundFlowInput } from './impl.ts';

export const DEFAULT_INPUT: LowerBoundFlowInput = {
  nodes: ['S', 'A', 'T'],
  edges: [
    { from: 'S', to: 'A', lower: 1, upper: 5 },
    { from: 'A', to: 'T', lower: 2, upper: 4 },
  ],
  source: 'S',
  sink: 'T',
};

export function buildTrace(input: LowerBoundFlowInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = maxFlowWithDemands(input);

  rec
    .begin({
      zh: `带下界最大流：源 ${input.source} 汇 ${input.sink}`,
      en: `Lower-bound max flow: ${input.source}->${input.sink}`,
    })
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `[${e.lower},${e.upper}]`,
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  if (!result.feasible) {
    rec
      .begin({ zh: `不可行`, en: `Infeasible` })
      .setAux([{ label: 'result', value: 'infeasible', role: 'warn' as BarRole }])
      .commit();
    return rec.build();
  }

  rec
    .begin({ zh: `最大流 = ${result.maxFlow}`, en: `Max flow = ${result.maxFlow}` })
    .setAux(
      result.flows.map((f) => ({
        label: `${f.from}→${f.to}`,
        value: `${f.flow}∈[${f.lower},${f.upper}]`,
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
