import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rcuModel } from './impl.ts';
export const DEFAULT_INPUT = { initial: 10, writes: [1, 2, -3], reads: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'RCU', en: 'RCU' }).commit();
  const cur = rcuModel(input.initial, input.writes, input.reads, {
    onRead: (v) =>
      rec
        .begin({ zh: '读 ' + v, en: 'read' })
        .setAux([{ label: 'val', value: String(v), role: 'compare' as BarRole }])
        .commit(),
    onWrite: (o, n) =>
      rec
        .begin({ zh: '写 ' + o + '->' + n, en: 'write' })
        .setAux([
          { label: 'old', value: String(o), role: 'pivot' as BarRole },
          { label: 'new', value: String(n), role: 'final' as BarRole },
        ])
        .commit(),
    onGrace: () =>
      rec
        .begin({ zh: '宽限期', en: 'grace' })
        .setAux([{ label: 'grace', value: 'gp', role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '终值 ' + cur, en: 'final ' + cur })
    .setAux([{ label: 'final', value: String(cur), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
