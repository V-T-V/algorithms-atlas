import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ascii85Encode } from './impl.ts';
export const DEFAULT_INPUT = [72, 101, 108, 108, 111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Ascii85', en: 'Ascii85' }).commit();
  const out = ascii85Encode(input, {
    onBlock: (c) =>
      rec
        .begin({ zh: '块 ' + c, en: 'block' })
        .setAux([{ label: 'chars', value: c, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + out, en: out })
    .setAux([{ label: 'out', value: out, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
