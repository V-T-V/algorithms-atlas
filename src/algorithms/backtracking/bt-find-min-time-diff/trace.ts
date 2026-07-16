import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinDifference } from './impl.ts';
export const DEFAULT_INPUT = ['23:59', '00:00'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最小时间差', en: 'Min time diff' }).commit();
  const m = findMinDifference(input, {
    onPerm: (p) =>
      rec
        .begin({ zh: p[0] + ' 与 ' + p[1], en: p[0] + ' & ' + p[1] })
        .setAux([{ label: 'pair', value: p.join(','), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最小 = ' + m + ' 分钟', en: 'min = ' + m + ' min' })
    .setAux([{ label: 'min', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
