import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rleEscapeEncode, rleEscapeDecode } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 1, 1, 1, 2, 3, 4, 4, 4, 4, 9];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '转义 RLE', en: 'Escape RLE' }).commit();
  const enc = rleEscapeEncode(input, {
    onRun: (b, c) =>
      rec
        .begin({ zh: '重复 ' + b + ' x' + c, en: 'run' })
        .setAux([{ label: 'run', value: b + 'x' + c, role: 'final' as BarRole }])
        .commit(),
    onLiteral: (n) =>
      rec
        .begin({ zh: '字面 ' + n, en: 'literal' })
        .setAux([{ label: 'lit', value: String(n), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '解压 ' + rleEscapeDecode(enc).join(','), en: 'decode' })
    .setAux([{ label: 'dec', value: rleEscapeDecode(enc).join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
