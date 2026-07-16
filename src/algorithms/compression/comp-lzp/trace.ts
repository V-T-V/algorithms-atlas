import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzpEncode } from './impl.ts';
export const DEFAULT_INPUT = [65, 66, 67, 65, 66, 68];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'LZP', en: 'LZP' }).commit();
  const out = lzpEncode(input, {
    onHit: (p, ctx) =>
      rec
        .begin({ zh: '命中 @' + p, en: 'hit @' + p })
        .setAux([{ label: 'hit', value: '@' + p, role: 'final' as BarRole }])
        .commit(),
    onMiss: (p, b) =>
      rec
        .begin({ zh: '字面 @' + p + '=' + b, en: 'miss' })
        .setAux([{ label: 'byte', value: String(b), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
