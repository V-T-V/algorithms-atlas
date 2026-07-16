import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOf7 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2];
  rec
    .begin({ zh: '7 元中位数', en: 'median of 7' })
    .setBars(data.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const m = medianOf7(data);
  rec
    .begin({ zh: `中位数=${m}`, en: `median=${m}` })
    .setBars(data.map((v) => ({ value: v, role: (v === m ? 'final' : 'default') as BarRole })))
    .commit();
  return rec.build();
}
