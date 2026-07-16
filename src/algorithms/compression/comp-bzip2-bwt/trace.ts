import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bwtTransform } from './impl.ts';
export const DEFAULT_INPUT = 'banana';
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BWT "' + input + '"', en: 'BWT "' + input + '"' }).commit();
  const { last, primary } = bwtTransform(input, {
    onRotation: (i, c) =>
      rec
        .begin({ zh: '行' + i + ': ' + String.fromCharCode(c), en: 'row' })
        .setAux([
          { label: 'row', value: String(i), role: 'compare' as BarRole },
          { label: 'last', value: String.fromCharCode(c), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '末列 ' + last + ' primary=' + primary, en: 'last' })
    .setAux([
      { label: 'last', value: last, role: 'final' as BarRole },
      { label: 'primary', value: String(primary), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
