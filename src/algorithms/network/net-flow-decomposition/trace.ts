// 流分解 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { decomposeFlow, type FlowEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  nodes: ['S', 'A', 'B', 'T'],
  edges: [
    { from: 'S', to: 'A', flow: 3 },
    { from: 'S', to: 'B', flow: 2 },
    { from: 'A', to: 'B', flow: 1 },
    { from: 'A', to: 'T', flow: 2 },
    { from: 'B', to: 'T', flow: 3 },
  ] as FlowEdge[],
  source: 'S',
  sink: 'T',
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const paths = decomposeFlow(input.edges, input.source, input.sink, input.nodes);

  rec
    .begin({
      zh: `流分解：原流值 ${input.edges.reduce((s, e) => s + (e.from === input.source ? e.flow : 0), 0)}`,
      en: `Flow decomposition: total ${input.edges.reduce((s, e) => s + (e.from === input.source ? e.flow : 0), 0)}`,
    })
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: String(e.flow),
        role: 'pivot' as BarRole,
      })),
    )
    .commit();

  paths.forEach((p, i) => {
    rec
      .begin({
        zh: `${p.isCycle ? '环' : '路径'} #${i + 1}：${p.nodes.join('→')} × ${p.amount}`,
        en: `${p.isCycle ? 'Cycle' : 'Path'} #${i + 1}: ${p.nodes.join('→')} × ${p.amount}`,
      })
      .setAux([
        {
          label: p.isCycle ? 'cycle' : 'path',
          value: `${p.nodes.join('→')} = ${p.amount}`,
          role: (p.isCycle ? 'warn' : 'final') as BarRole,
        },
      ])
      .commit();
  });

  rec
    .begin({
      zh: `分解完成：${paths.filter((p) => !p.isCycle).length} 条路径，${paths.filter((p) => p.isCycle).length} 个环`,
      en: `Done: ${paths.filter((p) => !p.isCycle).length} paths, ${paths.filter((p) => p.isCycle).length} cycles`,
    })
    .setAux([
      {
        label: 'total',
        value: String(paths.filter((p) => !p.isCycle).reduce((s, p) => s + p.amount, 0)),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
