import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotl, rotr } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const x = 0b00001111;
  rec
    .begin({ zh: 'x = ' + b(x), en: 'x = ' + b(x) })
    .setAux([{ label: 'x', value: b(x), role: 'pivot' as BarRole }])
    .commit();
  const y = rotl(x, 4, {
    onResult: (v) =>
      rec
        .begin({ zh: 'rotl 4 → ' + b(v), en: 'rotl 4 → ' + b(v) })
        .setAux([{ label: 'rotl4', value: b(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: 'rotl(0x0F,4)=0xF0', en: 'rotl(0x0F,4)=0xF0' })
    .setAux([{ label: '结果', value: b(y), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
