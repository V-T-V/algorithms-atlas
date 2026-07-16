import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floorLog2Fill } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 7, 8, 1023, 1024];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'floor log2 填充法', en: 'Floor log2 by fill' }).commit();
  for (const x of input) {
    const r = floorLog2Fill(x, {
      onFill: (v) =>
        rec
          .begin({ zh: 'filled = 0x' + (v >>> 0).toString(16), en: 'filled' })
          .setAux([{ label: 'filled', value: String(v >>> 0), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'log2(' + x + ')=' + r, en: 'log2(' + x + ')=' + r })
      .setAux([{ label: 'log2', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
