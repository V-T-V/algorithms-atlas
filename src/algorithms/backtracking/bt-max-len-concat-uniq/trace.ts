import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxLength } from './impl.ts';
export const DEFAULT_INPUT = ['un', 'iq', 'ue'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '拼接最大唯一串', en: 'Max concat unique' }).commit();
  const m = maxLength(input, {
    onPick: (i, len) =>
      rec
        .begin({ zh: '选 "' + input[i] + '" 长 ' + len, en: 'pick "' + input[i] + '"' })
        .setAux([{ label: 'len', value: String(len), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最大 = ' + m, en: 'max = ' + m })
    .setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
