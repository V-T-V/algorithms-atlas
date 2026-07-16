import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { swapNibbles } from './impl.ts';
const h = (n: number): string => '0x' + (n & 0xff).toString(16).padStart(2, '0');
export const DEFAULT_INPUT = [0xab, 0x12, 0xf0, 0x0f];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '交换半字节', en: 'Swap nibbles' }).commit();
  for (const x of input) {
    const r = swapNibbles(x, {
      onResult: (v) =>
        rec
          .begin({ zh: h(x) + ' → ' + h(v), en: h(x) + ' → ' + h(v) })
          .setAux([{ label: 'swapped', value: h(v), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: '结果 ' + h(r), en: 'result ' + h(r) })
      .setAux([{ label: 'result', value: h(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
