import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modPow } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2^10 mod 1000', en: '2^10 mod 1000' }).commit();
  const r = modPow(2, 10, 1000, {
    onBit: (bit, base, res) =>
      rec
        .begin({
          zh: `bit=${bit} base=${base} res=${res}`,
          en: `bit=${bit} base=${base} res=${res}`,
        })
        .setBars([{ value: res, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `result ${r}` })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
