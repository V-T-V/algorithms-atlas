import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xorDeltaEncode } from './impl.ts';
export const DEFAULT_INPUT = [100, 100, 105, 105, 110];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'XOR 增量', en: 'XOR delta' }).commit();
  const out = xorDeltaEncode(input, {
    onEmit: (i, x) =>
      rec
        .begin({ zh: 'i' + i + ' xor=' + x, en: 'xor' })
        .setAux([{ label: 'xor', value: String(x), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '输出 [' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
