import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mulawEncode, mulawDecode } from './impl.ts';
export const DEFAULT_INPUT = [1000, -2000, 30000, -30000, 500];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'μ-law 编码', en: 'mu-law encode' }).commit();
  const enc = mulawEncode(input, {
    onSample: (i, lin, e) =>
      rec
        .begin({ zh: 's' + i + '=' + lin + ' -> ' + e, en: 's' + i })
        .setAux([
          { label: 'lin', value: String(lin), role: 'compare' as BarRole },
          { label: 'enc', value: String(e), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '解码 ' + mulawDecode(enc).join(','), en: 'decode' })
    .setAux([{ label: 'dec', value: mulawDecode(enc).join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
