import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countBlocks } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b110011, 0b10101, 0b111, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '统计连续1块', en: 'Count runs of ones' }).commit();
  for (const x of input) {
    const r = countBlocks(x, {
      onRun: (i) =>
        rec
          .begin({ zh: '在第 ' + i + ' 位发现新段', en: 'new run at bit ' + i })
          .setAux([{ label: 'bit', value: String(i), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: b(x) + ' → ' + r + ' 段', en: b(x) + ' → ' + r + ' runs' })
      .setAux([{ label: 'runs', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
