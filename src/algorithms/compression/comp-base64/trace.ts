import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { base64Encode } from './impl.ts';
export const DEFAULT_INPUT = [72, 101, 108, 108, 111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Base64', en: 'Base64' }).commit();
  const out = base64Encode(input, {
    onQuartet: (c) =>
      rec
        .begin({ zh: '组 ' + c, en: 'quartet' })
        .setAux([{ label: 'chars', value: c, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + out, en: out })
    .setAux([{ label: 'out', value: out, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
