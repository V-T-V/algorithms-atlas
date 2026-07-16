import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { contextSwitchCount, type Segment } from './impl.ts';
export const DEFAULT_INPUT: Segment[] = [
  { id: 'A', start: 0, end: 2 },
  { id: 'B', start: 2, end: 4 },
  { id: 'A', start: 4, end: 6 },
];
export function buildTrace(input: Segment[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '上下文切换', en: 'Context switch' }).commit();
  const c = contextSwitchCount(input, {
    onSwitch: (f, t) =>
      rec
        .begin({ zh: f + ' → ' + t, en: f + ' → ' + t })
        .setAux([{ label: 'switch', value: f + '→' + t, role: 'swap' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + c + ' 次', en: c + ' switches' })
    .setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
