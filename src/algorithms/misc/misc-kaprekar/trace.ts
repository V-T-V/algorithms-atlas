import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isKaprekar } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 45;
  rec.begin({ zh: `卡布列克 ${n}`, en: `Kaprekar ${n}` }).commit();
  isKaprekar(n, {
    onSplit: (sq, l, r) =>
      rec
        .begin({ zh: `${sq} -> ${l}+${r}`, en: `${sq} -> ${l}+${r}` })
        .setBars([
          { value: l, role: 'pivot' as BarRole },
          { value: r, role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
