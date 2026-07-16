// 预流复原 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { restoreFlow, computeExcess, type PreflowEdge } from './impl.ts';

export const DEFAULT_INPUT = {
  nodes: ['S', 'A', 'B', 'T'],
  // 预流：A 有超额 2 (入 5 出 3)
  edges: [
    { from: 'S', to: 'A', flow: 5, capacity: 5 },
    { from: 'A', to: 'B', flow: 3, capacity: 4 },
    { from: 'B', to: 'T', flow: 3, capacity: 3 },
  ] as PreflowEdge[],
  source: 'S',
  sink: 'T',
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const before = computeExcess(input.edges, input.nodes, input.source, input.sink);

  rec
    .begin({
      zh: `预流：A 超额 ${before.get('A') ?? 0}`,
      en: `Preflow: A excess ${before.get('A') ?? 0}`,
    })
    .setAux(
      input.edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `${e.flow}/${e.capacity}`,
        role: 'warn' as BarRole,
      })),
    )
    .commit();

  const restored = restoreFlow(input.edges, input.nodes, input.source, input.sink, {
    onPush: (from, to, amount) => {
      rec
        .begin({ zh: `推送 ${amount}：${from} → ${to}`, en: `Push ${amount}: ${from} -> ${to}` })
        .setAux([{ label: 'push', value: `${from}->${to} ${amount}`, role: 'compare' as BarRole }])
        .commit();
    },
  });

  const after = computeExcess(restored, input.nodes, input.source, input.sink);
  rec
    .begin({
      zh: `复原完成：A 超额 ${after.get('A') ?? 0}`,
      en: `Restored: A excess ${after.get('A') ?? 0}`,
    })
    .setAux(
      restored.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `${e.flow}/${e.capacity}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
